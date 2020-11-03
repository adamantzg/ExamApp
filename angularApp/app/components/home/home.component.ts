import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  constructor(private userService: UserService
    ) { }

  errorMessage = '';
  user = this.userService.currentUser;
  attempts = 0;

  ngAfterViewInit(): void {
    
  } 

}
