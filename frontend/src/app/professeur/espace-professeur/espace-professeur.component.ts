import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Etudiant } from '../../model/model';
import { SideBarProfComponent } from "../side-bar-prof/side-bar-prof.component";
import { NgFor, NgIf } from '@angular/common';
import { EtudiantService } from '../../service/etudiant.service';

@Component({
  selector: 'app-espace-professeur',
  standalone: true,
  imports: [SideBarProfComponent, NgFor, NgIf],
  templateUrl: './espace-professeur.component.html',
  styleUrl: './espace-professeur.component.css'
})
export class EspaceProfesseurComponent {


  isDropdownOpen = false;


  //********************************** 
  listEtudiantsEncadre:Etudiant[]=[];
  constructor(private etudiantService:EtudiantService,private router:Router){
    etudiantService.getStudents().subscribe(
      (res:Etudiant[])=>{
        this.listEtudiantsEncadre=res;
      }
    );
    console.log("constructor : EspaceProfesseurComponent");
  }


   isStudentMenuOpen = false;
 
  
    toggleStudentMenu() {
      this.isStudentMenuOpen = !this.isStudentMenuOpen;
    }
  
    toggleDropdownMenu() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
 
      navigateToAjouterStage() {
        this.router.navigate(['/ajouterStage']);
      }
      
    
    
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      }
      // Fermer le menu si on clique à l'extérieur
      @HostListener('document:click', ['$event'])
      closeDropdown(event: Event) {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile && !userProfile.contains(event.target as Node)) {
          this.isDropdownOpen = false;
        }
      }
      logout() {
        console.log("Déconnexion en cours...");
        // Implémente ici la logique de déconnexion, par ex. suppression du token, redirection
        this.router.navigate(['/login']);
      }
      profilePicture: string = '/img/profil2.png'; // Image par défaut
    
    triggerFileInput() {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      fileInput.click();
    }
    
    updateProfilePicture(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profilePicture = e.target.result; // Met à jour la photo de profil
        };
        reader.readAsDataURL(input.files[0]);
      }
    }


}
