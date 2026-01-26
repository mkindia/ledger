import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser, Location } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { Meta } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class CommonSrvice {
  constructor(private _snackBar: MatSnackBar,
    private _location: Location,
    private media: MediaMatcher,
    private meta: Meta, @Inject(PLATFORM_ID) private platformId: Object) {}

  snackBar(message: string, actionButton?: string, duration?: number) {
    this._snackBar.open(message, actionButton, { panelClass: 'my-custom-snackbar', duration: duration, })
  }

  public setTheme(theme: 'light' | 'dark' | 'system') {
    this.applyTheme(theme)
  }

  private applyTheme(theme: 'light' | 'dark' | 'system') {

    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;

      body.classList.remove('light-theme', 'dark-theme');

      if (theme === 'dark') {
        // body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        this.meta.updateTag({ name: 'theme-color', content: '#000000ff' });
      }
      else if (theme === 'light') {
        // body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        this.meta.updateTag({ name: 'theme-color', content: '#ffffffff' });
        // this.meta.updateTag({ name: 'theme-color', content: '#000000' });
      }
      else {
        body.classList.remove('light-theme', 'dark-theme');
        let prefersDark = this.media.matchMedia('(prefers-color-scheme: dark)');
        body.classList.add(prefersDark.matches ? 'dark-theme' : 'light-theme');
        // console.log(prefersDark.matches);
        if (prefersDark.matches) {
          this.meta.updateTag({ name: 'theme-color', content: '#000000ff' });
        } else {
          this.meta.updateTag({ name: 'theme-color', content: '#ffffffff' });
        }
        // // let ff = this.media.matchMedia('(prefers-color-scheme: light)');
        // // console.log(ff.matches);
      }
    }
  }


  goBack() {
    this._location.back();
  }


   focus(event: any, previousElement?: HTMLInputElement | null, nextElement?: HTMLInputElement | null, value?: any): void {
    if (event.key == 'Backspace') {
      if (value == undefined || value == '') {
        previousElement?.focus();
      }
    }
    if (event.key == 'Enter') {
      nextElement?.focus();
    }
  }

}
