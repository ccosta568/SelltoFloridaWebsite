import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  dropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

}
