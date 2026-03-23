import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Navbar } from '../../../components/navbar/navbar';
import { FreelancerBackground } from '../freelancer-background';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [CommonModule, Navbar, FreelancerBackground, TitleCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class FreelancerProfile implements OnInit {
  private profileService = inject(ProfileService);

  // user info
  user = this.profileService.currentUser;
  name = this.user()?.fullName 
  role = this.user()?.role
  email = this.user()?.email
  phonenum = this.user()?.phoneNum
  location = this.user()?.location
  githubname = this.user()?.githubUsername
  primaryskills = this.user()?.professionalInfo.primarySkills.join(', ')
  techstack = this.user()?.professionalInfo.techStack.join(', ')
  exp = this.user()?.exp
  level = this.user()?.level
  experience = 'Wait'
  

  ngOnInit(): void {
    this.profileService.fetchProfile().subscribe({
      error: (err) => console.error('Failed to load profile:', err)
    });
  }
}