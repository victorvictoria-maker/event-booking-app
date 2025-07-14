// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { LoginFormComponent } from './login-form.component';
// import { ToastrModule, ToastrService } from 'ngx-toastr';
// import { provideHttpClient } from '@angular/common/http';
// import { provideRouter } from '@angular/router';
// import { Component } from '@angular/core';

// @Component({
//   template: '<div>This Component</div>',
// })
// class MockComponent {}

// describe('LoginFormComponent', () => {
//   let component: LoginFormComponent;
//   let fixture: ComponentFixture<LoginFormComponent>;
//   let mockToastrService: jasmine.SpyObj<ToastrService>;

//   beforeEach(async () => {
//     mockToastrService = jasmine.createSpyObj('ToastrService', [
//       'success',
//       'error',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [LoginFormComponent, ToastrModule.forRoot()],
//       providers: [
//         provideHttpClient(),
//         { provide: ToastrService, useValue: mockToastrService },
//         provideRouter([
//           { path: 'login', component: MockComponent },
//           { path: 'events', component: MockComponent },
//           { path: 'admin/login', component: MockComponent },
//           { path: 'admin/dashboard', component: MockComponent },
//         ]),
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });