import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class CompareComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      address: ['', [Validators.required]]
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      const formData = { ...this.contactForm.value, httpMethod: 'POST' };
      this.submitRequest(formData);
      this.fetchDataFromExternalAPI(formData.address);
    } else {
      alert('Please fill out the form correctly before submitting.');
    }
  }

  submitRequest(formData: any) {
    const url = "https://p47cqot9ql.execute-api.us-east-1.amazonaws.com/address/address";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(url, formData, { headers })
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.message === "Address Registered") {
            alert("Yes, Calculation Started");
          }
          this.contactForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          alert("Error Calculating");
        }
      );
  }

  fetchDataFromExternalAPI(address: string): void {
    const accessToken = "cbf50e611d7bdfb48c627d79f64af97d";
    const formattedAddress = address.replace(" ", "%20");
    const apiUrlWithParams = `https://api.bridgedataoutput.com/api/v2/zestimates_v2/zestimates?access_token=${accessToken}&address=${formattedAddress}`;
  
    console.log("Formatted Address= " + formattedAddress);
    console.log("apiURL= " + apiUrlWithParams);
  
    this.http.get(apiUrlWithParams)
      .subscribe(
        (response: any) => {
          const bundleValue = response.bundle;
  
          if (bundleValue) {
            if (Array.isArray(bundleValue)) {
              if (bundleValue.length === 0) {
                  console.warn("Bundle is empty");
                  alert("Please use a valid address");
              } else {
                  const firstItem = bundleValue[0];
                  if (firstItem.zestimate) {
                      const zestimate = parseFloat(firstItem.zestimate);
                      console.log("Zestimate: " + zestimate);
                      const newHomePrice = this.calculateProfit(zestimate); // Calculate new home price
                      this.fetchDataForURL(newHomePrice); // Fetch data for URL with new home price
                  } else {
                      console.warn("Zestimate value is null in the first bundle item");
                  }
              }
            } else {
              console.warn("Bundle is not an array");
            }
          } else {
            console.warn("Bundle not found in the API response");
          }
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          alert("Error fetching data from external API");
        }
      );
  }

  calculateProfit(zestimate: number): number {
    // Calculate the new home price after deducting a 10% commission
    const commissionPercentage = 0.10;
    const commissionAmount = zestimate * commissionPercentage;
    let newHomePrice = zestimate - commissionAmount;
  
    // Round the newHomePrice to the nearest thousand
    newHomePrice = Math.round(newHomePrice / 1000.0) * 1000.0;
  
    return newHomePrice;
  }

  fetchDataForURL(newHomePrice: number): void {
    const accessToken = "cbf50e611d7bdfb48c627d79f64af97d";
    const apiUrlWithParams = `https://api.bridgedataoutput.com/api/v2/zestimates_v2/zestimates?access_token=${accessToken}&state=FL&zestimate=${newHomePrice}`;
  
   // console.log("apiURL= " + apiUrlWithParams);
  
    this.http.get(apiUrlWithParams)
      .subscribe(
        (response: any) => {
     //     console.log("Response code " + response.status);
     //     console.log("API Response: " + JSON.stringify(response));
  
          const bundleValue = response.bundle;
  
          if (bundleValue) {
       //     console.log("Bundle: " + bundleValue);
  
            if (Array.isArray(bundleValue)) {
              if (bundleValue.length === 0) {
                console.warn("Bundle is empty");
              } else if (bundleValue.length === 1) {
                const item = bundleValue[0];
                if (item.zillowUrl) {
                  console.log("ZillowURLValue: " + item.zillowUrl);
                  this.openUrlInNewTab(item.zillowUrl);
                } else {
                  console.warn("ZillowURL value is null in the bundle item");
                }
              } else {
                const randomIndex = Math.floor(Math.random() * bundleValue.length);
                const randomItem = bundleValue[randomIndex];
                if (randomItem.zillowUrl) {
         //         console.log("Random Bundle Item: " + randomItem);
                  console.log("ZillowURLValue: " + randomItem.zillowUrl);
                  this.openUrlInNewTab(randomItem.zillowUrl);
                } else {
                  console.warn("ZillowURL value is null in the random bundle item");
                }
              }
            } else {
              console.warn("Bundle is not an array");
            }
          } else {
            console.warn("Bundle not found in the API response");
          }
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          alert("Error fetching data from external API");
        }
      );
  }
  
  openUrlInNewTab(url: string): void {
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus();
    } else {
      console.error("Failed to open the URL in a new tab");
    }
  }
}