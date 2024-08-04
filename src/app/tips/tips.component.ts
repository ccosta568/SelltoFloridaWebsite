import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      const formData = { ...this.contactForm.value, httpMethod: 'POST' };
      this.submitRequest(formData);
    } else {
      alert('Please fill out the form correctly before submitting.');
    }
  }

  submitRequest(formData: any) {
    const url = "https://k1gvzef931.execute-api.us-east-1.amazonaws.com/email/email";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(url, formData, { headers })
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.message === "Email Registered") {
            alert("Check Your Email!!!");
          } else {
            alert("Unexpected status code: " + response.status);
          }
          this.contactForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          alert("Error registering contact");
        }
      );
  }
}