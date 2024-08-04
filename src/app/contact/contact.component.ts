import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      message: ['']
    });
  }

  register() {
    if (this.contactForm.valid) {
      const formData = { ...this.contactForm.value, httpMethod: 'POST' };
      this.submitRequest(formData);
    } else {
      alert('Please fill out the form correctly before submitting.');
    }
  }

  submitRequest(formData: any) {
 /* const url = "https://0q4tu89sli.execute-api.us-east-1.amazonaws.com/NewTest/products"; */
    const url = "http://localhost:8080/api/contract";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    

    this.http.post(url, formData, { headers })
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.message === "New Contact Registered") {
            alert("Contact Registered Successfully");
          } else {
            alert("No, Unexpected status code: " + response.status);
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