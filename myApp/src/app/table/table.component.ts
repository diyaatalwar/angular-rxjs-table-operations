import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  selectAllPage = false;
  
  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getData().subscribe((result: any[]) => {
      this.data = result;
      this.updateFilteredData();
    });
  }

  updateFilteredData(): void {
    this.filteredData = this.data.filter(item =>
      Object.values(item).some(prop =>
        prop && prop.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.updateFilteredData();
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updateFilteredData();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredData();
    }
  }

  firstPage(): void {
    this.currentPage = 1;
    this.updateFilteredData();
  }

  lastPage(): void {
    this.currentPage = this.getTotalPages();
    this.updateFilteredData();
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  getPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredData.slice(startIndex, endIndex);
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  applySearch(): void {
    this.updateFilteredData();
    // Other search-related logic if needed
  }

  deleteItems(): void {
    this.data = this.data.filter((item) => !item.selected);
    this.updateFilteredData();
    this.selectAllPage = false;
  }

  selectAllItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredData.slice(startIndex, endIndex).forEach((item) => (item.selected = this.selectAllPage));;
  }

  editItem(item: any): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '400px',
      data: { ...item }, // Pass a copy of the item to avoid modifying the original
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the original item with the edited values
        Object.assign(item, result);
      }
    });
  }

  confirmDeleteItem(item: any): void {
    // Open a modal/dialog for delete confirmation
    // You can implement your modal logic here
    const confirmation = confirm('Are you sure you want to delete this row?');
    if (confirmation) {
      this.deleteItem(item);
    }
  }

  deleteItem(item: any): void {
    this.data = this.data.filter((dataItem) => dataItem !== item);
    this.updateFilteredData();
  }
}
