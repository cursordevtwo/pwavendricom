import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByRepositorio'
})
export class FilterByRepositorioPipe implements PipeTransform {
  transform(documents: any[], repositorio: any): any[] {
    if (!documents || !repositorio) {
      return documents;
    }
    return documents.filter(doc => doc.repositorio === repositorio.id);
  }
} 