import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public open(text: string, duration: number = 5000) {
    this.snackBar.open(text, 'Dismiss', { duration: duration });
  }
}
