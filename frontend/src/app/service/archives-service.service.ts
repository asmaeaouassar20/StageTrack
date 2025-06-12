import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ArchiveDto {
  id: number;
  etudiant: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  titre: string;
  tuteur: {
    nom: string;
  };
  dateDepot: string;
  note: string;
  nomFichierRapport?: string;
  typeFichierRapport?: string;
  annee?: string;
  statutRapport: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArchivesService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les headers avec authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  // Récupérer les archives avec authentification
  getArchives(annee?: number): Observable<ArchiveDto[]> {
    let params = new HttpParams();
    
    if (annee) {
      params = params.set('annee', annee.toString());
    }
    
    params = params.set('etat', 'VALIDE');
    
    console.log('Appel API getArchives avec paramètres:', { annee, etat: 'VALIDE' });
    
    return this.http.get<ArchiveDto[]>(`${this.apiUrl}/stages/archives`, { 
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Télécharger un rapport avec authentification
  downloadRapport(stageId: number): Observable<Blob> {
    console.log('Téléchargement du rapport pour stage ID:', stageId);
    
    return this.http.get(`${this.apiUrl}/stages/${stageId}/rapport/download`, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Visualiser un rapport avec authentification
  viewRapport(stageId: number): Observable<Blob> {
    console.log('Visualisation du rapport pour stage ID:', stageId);
    
    return this.http.get(`${this.apiUrl}/stages/${stageId}/rapport/view`, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Exporter vers Excel avec authentification
  exportExcel(annee: number): Observable<Blob> {
    let params = new HttpParams()
      .set('annee', annee.toString())
      .set('etat', 'VALIDE');
    
    console.log('Export Excel avec paramètres:', { annee, etat: 'VALIDE' });
    
    // Combiner les headers d'authentification avec les headers spécifiques
    const authHeaders = this.getAuthHeaders();
    const headers = authHeaders.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream');
    
    return this.http.get(`${this.apiUrl}/stages/export/excel`, {
      params,
      responseType: 'blob',
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les années disponibles avec authentification
  getAvailableYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/stages/annees`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs améliorée
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue s\'est produite';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.message}`;
      if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que l\'API est démarrée.';
      } else if (error.status === 401) {
        errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
        // Optionnel : rediriger vers la page de connexion
        // this.router.navigate(['/login']);
      } else if (error.status === 403) {
        errorMessage = 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
      }
    }
    
    console.error('Erreur HTTP:', error);
    console.error('Message d\'erreur:', errorMessage);
    
    return throwError(() => new Error(errorMessage));
  }
}