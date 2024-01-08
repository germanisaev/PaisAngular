import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AccountService } from '../../shared/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AccountService]
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  Message = '';
  isMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isMessage = false;

    // reset alerts on submit
    

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    /* localStorage.setItem('user', JSON.stringify(this.loginForm.value));
    this.router.navigate(['/employees']); */
    
    this.accountService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value)
      .pipe(first())
      .subscribe({
        next: (user: any) => {
          console.log(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/layuot']);
        },
        error: (error: any) => {
          console.log(error);
          this.Message = error;
          this.isMessage = true;
          this.loading = false;
        }
      });
  }
}
