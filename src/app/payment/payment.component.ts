import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Invoice {
  id: number;
  reference: string;
  date: Date;
  amount: number;
  paid: boolean;
  description: string;
  dueDate: Date;
  selected: boolean;
  isOverdue: boolean;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface PaymentInfo {
  multiple: boolean;
  invoice?: Invoice;
  invoices?: Invoice[];
  amount: number;
}
@Component({
  selector: 'app-payment',
  imports: [  CommonModule,FormsModule],
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  // Données des factures
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  
  // Filtres et tri
  searchTerm: string = '';
  statusFilter: string = 'all';
  sortColumn: string = 'date';
  sortDirection: string = 'desc';
  
  // Sélection des factures
  selectedCount: number = 0;
  selectedAmount: number = 0;
  allSelected: boolean = false;
  
  // Modales
  showPaymentModal: boolean = false;
  showConfirmationModal: boolean = false;
  
  // Paiement
  paymentMethod: string = 'card';
  cardDetails: CardDetails = {
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  };
  currentPayment: PaymentInfo = {
    multiple: false,
    amount: 0
  };
  transactionReference: string = '';
  
  // Statistiques
  totalAmount: number = 0;
  unpaidInvoices: Invoice[] = [];

  constructor() { }

  ngOnInit(): void {
    // Charger les données des factures (simulation)
    this.loadInvoices();
    
    // Initialiser les filtres
    this.applyFilters();
    
    // Calculer les statistiques
    this.calculateStatistics();
  }

  /**
   * Charge les données des factures (simulation)
   */
  loadInvoices(): void {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Générer des factures de test
    this.invoices = [
      {
        id: 1,
        reference: 'FAC-2025-0001',
        date: new Date(today.getTime() - 30 * oneDay),
        amount: 156.42,
        paid: false,
        description: 'Abonnement mensuel - Janvier 2025',
        dueDate: new Date(today.getTime() - 5 * oneDay),
        selected: false,
        isOverdue: true
      },
      {
        id: 2,
        reference: 'FAC-2025-0002',
        date: new Date(today.getTime() - 25 * oneDay),
        amount: 89.90,
        paid: true,
        description: 'Services additionnels - Janvier 2025',
        dueDate: new Date(today.getTime() - 10 * oneDay),
        selected: false,
        isOverdue: false
      },
      {
        id: 3,
        reference: 'FAC-2025-0003',
        date: new Date(today.getTime() - 15 * oneDay),
        amount: 156.42,
        paid: false,
        description: 'Abonnement mensuel - Février 2025',
        dueDate: new Date(today.getTime() + 15 * oneDay),
        selected: false,
        isOverdue: false
      },
      {
        id: 4,
        reference: 'FAC-2025-0004',
        date: new Date(today.getTime() - 10 * oneDay),
        amount: 45.50,
        paid: false,
        description: 'Services additionnels - Février 2025',
        dueDate: new Date(today.getTime() + 20 * oneDay),
        selected: false,
        isOverdue: false
      },
      {
        id: 5,
        reference: 'FAC-2025-0005',
        date: new Date(today.getTime() - 5 * oneDay),
        amount: 120.00,
        paid: false,
        description: 'Prestation spéciale',
        dueDate: new Date(today.getTime() + 25 * oneDay),
        selected: false,
        isOverdue: false
      }
    ];
    
    this.filteredInvoices = [...this.invoices];
  }

  /**
   * Calcule les statistiques globales
   */
  calculateStatistics(): void {
    this.unpaidInvoices = this.invoices.filter(invoice => !invoice.paid);
    this.totalAmount = this.unpaidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  }

  /**
   * Applique les filtres et tris à la liste des factures
   */
  applyFilters(): void {
    // Filtrer par statut
    let filtered = this.invoices;
    if (this.statusFilter === 'paid') {
      filtered = filtered.filter(invoice => invoice.paid);
    } else if (this.statusFilter === 'unpaid') {
      filtered = filtered.filter(invoice => !invoice.paid);
    }
    
    // Filtrer par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.reference.toLowerCase().includes(term) || 
        invoice.description.toLowerCase().includes(term)
      );
    }
    
    // Trier les résultats
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortColumn) {
        case 'reference':
          comparison = a.reference.localeCompare(b.reference);
          break;
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = (a.paid === b.paid) ? 0 : a.paid ? 1 : -1;
          break;
        default:
          return 0;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.filteredInvoices = filtered;
  }

  /**
   * Change la colonne de tri
   * @param column Nom de la colonne pour le tri
   */
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      // Inverser la direction si c'est déjà la colonne de tri
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Nouvelle colonne de tri
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }

  /**
   * Sélectionne ou désélectionne toutes les factures
   */
  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    
    // Ne sélectionner que les factures non payées
    this.filteredInvoices.forEach(invoice => {
      if (!invoice.paid) {
        invoice.selected = this.allSelected;
      }
    });
    
    this.updateSelectedCount();
  }

  /**
   * Met à jour le compteur de factures sélectionnées
   */
  updateSelectedCount(): void {
    const selectedInvoices = this.invoices.filter(invoice => invoice.selected);
    this.selectedCount = selectedInvoices.length;
    this.selectedAmount = selectedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  }

  /**
   * Vérifie si des factures sont sélectionnées
   */
  hasSelectedInvoices(): boolean {
    return this.selectedCount > 0;
  }

  /**
   * Efface la sélection de factures
   */
  clearSelection(): void {
    this.invoices.forEach(invoice => invoice.selected = false);
    this.allSelected = false;
    this.updateSelectedCount();
  }

  /**
   * Affiche les détails d'une facture
   * @param invoice Facture à afficher
   */
  showDetails(invoice: Invoice): void {
    // À implémenter: afficher les détails complets de la facture
    console.log('Affichage des détails de la facture', invoice);
    alert(`Détails de la facture ${invoice.reference}:\n\n${invoice.description}\nDate: ${invoice.date.toLocaleDateString()}\nMontant: ${invoice.amount.toFixed(2)} €`);
  }

  /**
   * Initie le paiement d'une facture
   * @param invoice Facture à payer
   */
  payInvoice(invoice: Invoice): void {
    this.currentPayment = {
      multiple: false,
      invoice: invoice,
      amount: invoice.amount
    };
    
    this.showPaymentModal = true;
  }

  /**
   * Initie le paiement des factures sélectionnées
   */
  paySelected(): void {
    const selectedInvoices = this.invoices.filter(invoice => invoice.selected);
    
    if (selectedInvoices.length === 0) {
      return;
    }
    
    this.currentPayment = {
      multiple: true,
      invoices: selectedInvoices,
      amount: this.selectedAmount
    };
    
    this.showPaymentModal = true;
  }

  /**
   * Sélectionne la méthode de paiement
   * @param method Méthode de paiement ('card' ou 'transfer')
   */
  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
  }

  /**
   * Génère une référence pour le virement bancaire
   */
  generateTransferReference(): string {
    if (this.currentPayment.multiple) {
      return `PAY-${new Date().getTime().toString().substr(-6)}`;
    } else if (this.currentPayment.invoice) {
      return `PAY-${this.currentPayment.invoice.reference}`;
    }
    
    return '';
  }

  /**
   * Vérifie si le formulaire de paiement est valide
   */
  isPaymentFormValid(): boolean {
    if (this.paymentMethod === 'transfer') {
      return true; // Pour les virements, pas de validation requise
    }
    
    // Validation basique des champs de carte bancaire
    return (
      this.cardDetails.number.length >= 16 &&
      this.cardDetails.expiry.length === 5 &&
      this.cardDetails.cvv.length >= 3 &&
      this.cardDetails.name.length > 3
    );
  }

  /**
   * Traite le paiement
   */
  processPayment(): void {
    // Simuler un traitement de paiement
    setTimeout(() => {
      // Générer une référence de transaction
      this.transactionReference = `TX-${new Date().getTime()}`;
      
      // Marquer les factures comme payées
      if (this.currentPayment.multiple && this.currentPayment.invoices) {
        this.currentPayment.invoices.forEach(invoice => {
          const originalInvoice = this.invoices.find(i => i.id === invoice.id);
          if (originalInvoice) {
            originalInvoice.paid = true;
            originalInvoice.selected = false;
          }
        });
      } else if (this.currentPayment.invoice) {
        const originalInvoice = this.currentPayment.invoice 
          ? this.invoices.find(i => i.id === this.currentPayment.invoice!.id) 
          : undefined;
        if (originalInvoice) {
          originalInvoice.paid = true;
        }
      }
      
      // Mettre à jour les listes et statistiques
      this.updateSelectedCount();
      this.applyFilters();
      this.calculateStatistics();
      
      // Fermer la modale de paiement et afficher la confirmation
      this.showPaymentModal = false;
      this.showConfirmationModal = true;
      
      // Réinitialiser le formulaire de carte
      this.cardDetails = {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      };
    }, 1500); // Simuler un délai de traitement
  }

  /**
   * Ferme la modale de paiement
   */
  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  /**
   * Ferme la modale de confirmation
   */
  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
  }

  /**
   * Ferme toutes les modales
   */
  closeAllModals(): void {
    this.showPaymentModal = false;
    this.showConfirmationModal = false;
  }
}