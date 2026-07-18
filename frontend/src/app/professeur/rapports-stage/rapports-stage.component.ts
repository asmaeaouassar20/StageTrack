
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { Component ,ElementRef,inject,OnInit,ViewChild} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DepotRapportStage, Evaluation } from '../../model/model';
import { ServiceService } from '../../service/service.service';
import { StatutRapport } from '../../model/enums';
import { FormGroup,FormControl,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import { SideBarProfComponent } from "../side-bar-prof/side-bar-prof.component";

@Component({
  selector: 'app-rapports-stage',
  standalone:true,
  imports: [RouterLink,
    DatePipe,
    NgStyle,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule, SideBarProfComponent],
  templateUrl: './rapports-stage.component.html',
  styleUrl: './rapports-stage.component.css'
})

export class RapportsStageComponent implements OnInit{

  listDepotsRapport:DepotRapportStage[]=[];

  // Modal pour l'évaluation d'un rapport
  @ViewChild('voirevaluationmodal') voirEvaluationModal: ElementRef | undefined;
  @ViewChild('addevaluationmodal') addEvaluationModal:ElementRef | undefined;


  // Dépot de stage to evaluate
  formAddEvaluation=new FormGroup({
    note:new FormControl(''),
    comment:new FormControl('')
  })

  // Pour éditer le statut d'un rapport
  idDepotToEditStatut:number=-1;  
 

  evaluationDepotSelectionne!:Evaluation | null | undefined;
  idDepotRapStageToEvaluate:number=-1;

  service=inject(ServiceService);
  snackbar=inject(MatSnackBar);

  ngOnInit(){
    this.listDepotsRapport=this.service.getRapports();
   this.fetchRappStageAddSelectedProp();
  }



  fetchRappStageAddSelectedProp(){
    this.listDepotsRapport=this.listDepotsRapport.map(depot=>({
      ...depot,
      selectedRadio:depot.selectedRadio || null // ajouter une propriété 'selectdRadio' si elle n'existe pas
    }))

    this.listDepotsRapport.forEach(depot=>{

      if(depot.statut==StatutRapport.V){
        depot.selectedRadio='V';
      }else if(depot.statut==StatutRapport.NV){
        depot.selectedRadio='NV';
      }else{
        depot.selectedRadio=null;
      }
    })
  }


  getColorSelonStatut(statut:StatutRapport | null){
    switch(statut){
      case StatutRapport.V:
        return 'rgb(68, 193, 68)';
      case StatutRapport.NV:
        return 'rgb(255, 70, 70)';
      default:
        return 'grey';
    }
  }

  voirEvaluationOpenModal(idDepotRapport:number){
    if(this.voirEvaluationModal){
      this.voirEvaluationModal.nativeElement.style.display='block';
      const depotStageCourant=this.service.getDepotById(idDepotRapport);
      this.evaluationDepotSelectionne=depotStageCourant?.evaluation;
    }
  }

  closeModal(){
    if(this.voirEvaluationModal){
      this.voirEvaluationModal.nativeElement.style.display='none';
    }
  }


  openModalAddEval(idDepotRapport:number){
    if(this.addEvaluationModal){
      this.addEvaluationModal.nativeElement.style.display='block';
      this.idDepotRapStageToEvaluate=idDepotRapport;
    }
  }

  closeModalAddEval(){
    if(this.addEvaluationModal){
      this.addEvaluationModal.nativeElement.style.display='none';
    }
  }

  saveEvaluation(){
    const newEvaluation:Evaluation={
      id:Math.floor(Math.random()*52),
      note: Number(this.formAddEvaluation.value.note) ?? 0 ,
      commentaire:this.formAddEvaluation.value.comment ?? ''
    }

    this.service.setEvaluation(this.idDepotRapStageToEvaluate,newEvaluation);
    this.closeModalAddEval();
    this.snackbar.open("L'évaluation du rapport est ajouté avec succès","Close",{duration:5000});
  }

  resetRadioCheck(depotRapport:DepotRapportStage){
    depotRapport.selectedRadio=null;
  }


  editStatut(id:number,statut:StatutRapport){
    this.idDepotToEditStatut=id;
    
  }

  saveNewStatus(depot:DepotRapportStage){
    if(depot.selectedRadio!=null && depot.selectedRadio!=undefined){
      this.listDepotsRapport=this.service.setStatutRapportById(depot.id,depot.selectedRadio);
      this.idDepotToEditStatut=-1;
      this.fetchRappStageAddSelectedProp();
    }
   
  }

}
