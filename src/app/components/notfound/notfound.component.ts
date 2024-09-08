import { Component, OnInit } from '@angular/core';
import { NavAuthComponent } from "../nav-auth/nav-auth.component";
import { NavBlankComponent } from "../nav-blank/nav-blank.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [NavAuthComponent, NavBlankComponent, FooterComponent],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss',
})
export class NotfoundComponent implements OnInit {
  loggedIn: boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem('userToken')) {
      this.loggedIn = true;
    }
  }
}
