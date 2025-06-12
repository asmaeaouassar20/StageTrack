// rapport.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RapportStageDto {
  id: number;
  etudiant: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  stage: {
    id: number;
    nomEntreprise: string;
    intituleSujet: string;
    dateDepot: string;
    domaine: string;
    statutRapport: string;
    nomFichierRapport?: string;
    typeFichierRapport?: string;
  };
  titre?: string;
  etat?: string;
  dateDepot?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RapportService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Récupérer tous les rapports avec filtrage optionnel
  getRapportsFiltres(etat?: string): Observable<RapportStageDto[]> {
    let params = new HttpParams();
    if (etat && etat !== 'undefined') {
      params = params.set('etat', etat);
    }
    
    return this.http.get<RapportStageDto[]>(`${this.apiUrl}/rapports`, { params });
  }

  // Télécharger un rapport PDF
  downloadRapport(stageId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/stages/${stageId}/rapport`, {
      responseType: 'blob'
    });
  }

  // Récupérer les détails d'un rapport pour visualisation
  getRapportDetails(stageId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stages/${stageId}`);
  }

  // Mettre à jour le statut d'un rapport
  updateRapportStatus(stageId: number, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/stages/${stageId}/statut`, { statutRapport: statut });
  }
}