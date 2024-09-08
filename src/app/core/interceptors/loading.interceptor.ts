import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const _loader = inject(NgxSpinnerService);

  _loader.show();

  return next(req).pipe(finalize(() => _loader.hide()));
};
