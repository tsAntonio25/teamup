import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, NgFor, NgClass, Navbar],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  tickerItems = [
    '⚡ QUEST ACTIVE', '🏆 PROOF OF SKILL', '🌐 ANGELES CITY',
    '💻 BUILD THE FUTURE', '🎯 LEVEL UP', '🚀 JOIN THE PARTY',
    '⚔️ TEAMUP NOW', '🔥 63% SKILLS GAP', '🇵🇭 CLARK FREEPORT',
  ];

  ticker2 = [
    "⚔️ DON'T QUEST ALONE", "⚔️ DON'T QUEST ALONE",
    "⚔️ DON'T QUEST ALONE", "⚔️ DON'T QUEST ALONE",
    "⚔️ DON'T QUEST ALONE", "⚔️ DON'T QUEST ALONE",
  ];

  missions = [
    {
      img: 'https://i.postimg.cc/MfHkT5nJ/Cozy-Pixel-Art-Cafe-Scene-Autumn-Coffee-Shop-Aesthetic-with-Pastries-Warm-Lighting.jpg',
      affiliate: 'LOCAL BUSINESS',
      title: 'DIGITAL MENU FOR LOCAL CAFE',
      desc: 'Build a modern digital ordering system for a beloved local eatery in Clark.',
      difficulty: 'easy',
      xp: 250
    },
    {
      img: 'https://i.postimg.cc/m1tqRrnN/Amy-s-Fantasies-PC-98.jpg',
      affiliate: 'REAL ESTATE',
      title: 'DIGITAL INNOVATION HUB',
      desc: 'Design a property listing platform for the Clark Freeport Zone.',
      difficulty: 'medium',
      xp: 500
    },
    {
      img: 'https://i.postimg.cc/DWnM06NR/(22).jpg',
      affiliate: 'E-COMMERCE',
      title: 'E-COMMERCE PLATFORM LAUNCH',
      desc: 'Launch a full-stack marketplace connecting local artisans with global buyers.',
      difficulty: 'hard',
      xp: 1000
    },
  ];

  roles = [
    {
      img: 'https://i.postimg.cc/mzcXRmZ8/Screenshot-2026-03-18-at-1-16-36-PM.png',
      name: 'THE PARTY MASTER',
      shortName: 'Party Master',
      stars: 5,
      rank: 'High-Level Professional (3000+ GitHub commits)',
      mission: 'Provide core project architecture and technical strategy. Lead the team.',
      quest: 'Mentor apprentices through real-world challenges using professional workflows.',
      loot: 'Earns leadership XP, project compensation, and community reputation.'
    },
    {
      img: 'https://i.postimg.cc/mzcXRmZ8/Screenshot-2026-03-18-at-1-16-36-PM.png',
      name: 'THE APPRENTICE',
      shortName: 'Apprentice',
      stars: 3,
      rank: 'Student / Junior Developer',
      mission: 'Learn industry tactics via real-world projects under a Party Master.',
      quest: 'Build a battle-verified portfolio while solving actual local business problems.',
      loot: 'Levels up technical skills, earns XP, builds a verified commit history.'
    },
    {
      img: 'https://i.postimg.cc/mzcXRmZ8/Screenshot-2026-03-18-at-1-16-36-PM.png',
      name: 'THE COMMISSIONER',
      shortName: 'Commissioner',
      stars: 4,
      rank: 'Local Business Owner / SME',
      mission: 'Provide real-world business challenges and project funding to the hub.',
      quest: 'Outsource IT needs to a high-trust, mentored developer team.',
      loot: 'Receives high-quality digital solutions while supporting local tech growth.'
    },
  ];

  getArr(n: number): number[] {
    return Array(n).fill(0);
  }
}