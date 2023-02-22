import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  successSnackBar(message: string) {
    this.zone.run(() => {
      this.snackBar.open(message, "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "success-snackbar",
        duration: 3000,
      });
    });
  }

  warningSnackBar(error: any) {
    this.zone.run(() => {
      this.snackBar.open(`Warning ${error.statusText}, error is: ` + error.name, "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "warning-snackbar",
        duration: 3000,
      });
    });
  }

  backendWarningSnackBar(message: any) {
    this.zone.run(() => {
      this.snackBar.open(message, "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "warning-snackbar",
        duration: 3000,
      });
    });
  }

  public errorSnackBar(error: any) {
    this.zone.run(() => {
      this.snackBar.open(`Backend returned code ${error.status}, body was: ` + JSON.stringify(error.error), "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "error-snackbar",
        duration: 3000,
      });
    });
  }
}
