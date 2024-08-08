import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavigationService } from '../../shared/services/navigation.service';
import { config } from 'src/app/shared/config/config';
import { ToastService } from 'src/app/shared/services/toast.service';
import { API_CONSTANTS } from 'src/app/shared/config/api-config';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { ConstantService } from '../../shared/services/constant.service';
import { LoadingService } from '../../shared/services/loading.service';
import { ControlPanelService } from '../admin/control-panel/control-panel.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationOffersComponent } from '../../shared/shared-components/notification-offers/notification-offers.component';
import { BannerImageComponent } from '../../shared/shared-components/banner-image/banner-image.component';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isLoginSubject = new BehaviorSubject<boolean>(AuthService.hasToken());
    isLoggedIn: Observable<any> = new BehaviorSubject<boolean>(false);

    constructor(
        private _formBuilder: FormBuilder,
        private _apiService: ApiService,
        private _router: Router,
        public _jwtHelper: JwtHelperService,
        private _navigationService: NavigationService,
        private _toastService: ToastService,
        private _constantService: ConstantService,
        private _loadingService: LoadingService,
        private _conrolPanelService: ControlPanelService,
        private _matDialog: MatDialog
    ) { }

    /**
     * Create Signin Form
     */
    createSigninForm(): FormGroup {
        return this._formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required]
        })
    }

    /**
     * Create Signin Form
     */
    createUserSigninForm(): FormGroup {
        return this._formBuilder.group({
            role: [null, Validators.required],
            username: [null, Validators.required],
            password: [null, Validators.required]
        })
    }

    /**
     * Create Forgot Password Form
     */
    createForgotPasswordForm(): FormGroup {
        return this._formBuilder.group({
            email: [null, [Validators.required, Validators.email]]
        })
    }

    adminLogin(data: any) {
        this._loadingService.loading.next(true);
        this._apiService.post(data, API_CONSTANTS.ADMIN_LOGIN).then((response: ApiResponse) => {
            if (response && response.status === 'OK') {
                localStorage.setItem(`${config.appShortName}UserToken`, response.data.token);
                let user = {
                    id: response.data.user_details.id,
                    email: response.data.user_details.email,
                    name: response.data.user_details.name,
                    role: response.data.user_details.role,
                    mobileNumber: response.data.user_details.mobileNumber,
                    verify: response.data.user_details.verify,
                    profileImage: null,
                    currency: response.data.user_details.currency,
                    parentId: response.data.user_details.parentId
                };
                localStorage.setItem(`${config.appShortName}User`, JSON.stringify(user));
                this.isLoginSubject.next(true);
                this._navigationService.setNavigation();
                this._loadingService.loading.next(false);
                this._router.navigate(['/admin/dashboard']);
            } else {
                this._loadingService.loading.next(false);
                this._toastService.error(response.message);
            }
        }, error => {
            this._loadingService.loading.next(false);
            if (error.status !== 0)
                this._toastService.error(error.error.message);
            else
                this._toastService.error("Server Error");
        })
    }

    /**
 * Login User
 * 
 * @param data 
 */
    login(data: any) {
        return this._apiService.post(data, 'auth/login');
    }

    verifyLogin(data: any) {
        this._loadingService.loading.next(true);
        this._apiService.post(data, 'login/verify').then((response: any) => {
            if (response && response.status === 'OK') {
                localStorage.setItem(`${config.appShortName}UserToken`, response.data.token);
                let user = {
                    id: response.data.user_details.id,
                    email: response.data.user_details.email,
                    name: response.data.user_details.name,
                    role: response.data.user_details.role,
                    mobileNumber: response.data.user_details.mobileNumber,
                    verify: response.data.user_details.verify,
                    profileImage: response.data.user_details.profileImage,
                    companyInfoStatus: response.data.user_details.companyInfoStatus,
                    currency: response.data.user_details.currency
                };
                localStorage.setItem(`${config.appShortName}User`, JSON.stringify(user));
                this.isLoginSubject.next(true);
                this._navigationService.setNavigation();
                this._loadingService.loading.next(false);
                if (user.role === 'ROLE_AGENT') {
                    if (user.companyInfoStatus === 1) {
                        const propertyName = 'notificationOrOffersForAgent';
                        let value = this._conrolPanelService.dataControl.getValue();
                        // if (value && value[propertyName]) {
                        //     this._matDialog.open(NotificationOffersComponent, {
                        //         width: '600px',
                        //         height: '400px',
                        //         data: value[propertyName],
                        //         disableClose: true
                        //     });
                        // }
                        if (value && value['agentBannerImage']) {
                            this._matDialog.open(BannerImageComponent, {
                                width: '700px',
                                height: '500px',
                                data: { image: value['agentBannerImage'], type: 'agentBannerImage' },
                                disableClose: true
                            });
                        }
                        this._router.navigate(['/admin/property/search']);
                    } else {
                        this._router.navigate(['/admin/profile/edit/property']);
                    }
                } else if (user.role === 'ROLE_PROPERTY') {
                    const propertyName = 'notificationOrOffersForProperty';
                    let value = this._conrolPanelService.dataControl.getValue();
                    // if (value && value[propertyName]) {
                    //     this._matDialog.open(NotificationOffersComponent, {
                    //         width: '600px',
                    //         height: '400px',
                    //         data: value[propertyName],
                    //         disableClose: true
                    //     });
                    // }
                    if (value && value['propertyBannerImage']) {
                        this._matDialog.open(BannerImageComponent, {
                            width: '700px',
                            height: '500px',
                            data: { image: value['propertyBannerImage'], type: 'propertyBannerImage' },
                            disableClose: true
                        });
                    }
                    this._router.navigate(['/admin/dashboard']);
                } else if (user.role === 'ROLE_EXECUTIVE') {
                    this._router.navigate(['/admin/property/search']);
                }
            } else {
                this._loadingService.loading.next(false);
                this._toastService.error(response.message);
            }
        }, error => {
            this._loadingService.loading.next(false);
            if (error.status !== 0)
                this._toastService.error(error.error.message);
            else
                this._toastService.error("Server Error");
        })
    }

    byPassLogin(response: any) {
        localStorage.setItem(`${config.appShortName}UserToken`, response.data.token);
        let user = {
            id: response.data.user_details.id,
            email: response.data.user_details.email,
            name: response.data.user_details.name,
            role: response.data.user_details.role,
            mobileNumber: response.data.user_details.mobileNumber,
            verify: response.data.user_details.verify,
            profileImage: response.data.user_details.profileImage,
            companyInfoStatus: response.data.user_details.companyInfoStatus,
            currency: response.data.user_details.currency
        };
        localStorage.setItem(`${config.appShortName}User`, JSON.stringify(user));
        this.isLoginSubject.next(true);
        this._navigationService.setNavigation();
        this._loadingService.loading.next(false);
        if (user.role === 'ROLE_AGENT') {
            if (user.companyInfoStatus === 1) {
                const propertyName = 'notificationOrOffersForAgent';
                let value = this._conrolPanelService.dataControl.getValue();
                // if (value && value[propertyName]) {
                //     this._matDialog.open(NotificationOffersComponent, {
                //         width: '600px',
                //         height: '400px',
                //         data: value[propertyName],
                //         disableClose: true
                //     });
                // }
                if (value && value['agentBannerImage']) {
                    this._matDialog.open(BannerImageComponent, {
                        width: '700px',
                        height: '500px',
                        data: { image: value['agentBannerImage'], type: 'agentBannerImage' },
                        disableClose: true
                    });
                }
                this._router.navigate(['/admin/property/search']);
            } else {
                this._router.navigate(['/admin/profile/edit/property']);
            }
        } else if (user.role === 'ROLE_PROPERTY') {
            const propertyName = 'notificationOrOffersForProperty';
            let value = this._conrolPanelService.dataControl.getValue();
            // if (value && value[propertyName]) {
            //     this._matDialog.open(NotificationOffersComponent, {
            //         width: '600px',
            //         height: '400px',
            //         data: value[propertyName],
            //         disableClose: true
            //     });
            // }
            if (value && value['propertyBannerImage']) {
                this._matDialog.open(BannerImageComponent, {
                    width: '700px',
                    height: '500px',
                    data: { image: value['propertyBannerImage'], type: 'propertyBannerImage' },
                    disableClose: true
                });
            }
            this._router.navigate(['/admin/dashboard']);
        } else if (user.role === 'ROLE_EXECUTIVE') {
            this._router.navigate(['/admin/property/search']);
        }
    }

    /**
     * Method For has token
     */
    private static hasToken(): boolean {
        return !!localStorage.getItem(`${config.appShortName}UserToken`);
    }

    /**
     * Log out the user then tell all the subscribers about the new status
     */
    logout(): void {
        let authUser = this.getAuthUser();
        localStorage.removeItem(`${config.appShortName}UserToken`);
        localStorage.removeItem(`${config.appShortName}User`);
        localStorage.removeItem(`${config.appShortName}PropertyFilterForm`);
        localStorage.removeItem("selectedRooms");
        localStorage.removeItem("bookingFilterForm");
        this.isLoginSubject.next(false);
        if (authUser.role === 'ROLE_SUPER_ADMIN' || authUser.role === 'ROLE_ADMIN') {
            this._router.navigateByUrl("/admin/signin");
        } else {
            this._router.navigateByUrl("/signin");
        }
    }

    getAuthUser(): any {
        let user = localStorage.getItem(`${config.appShortName}User`);
        return user ? JSON.parse(user) : null;
    }

    getAuthToken(): any {
        return localStorage.getItem(`${config.appShortName}UserToken`);
    }

    /**
     * Is Authenticated
     */
    public isAuthenticated(): boolean {
        const token: any = this.getAuthToken();
        //Check whether the token is expired and return
        //true or false
        return !this._jwtHelper.isTokenExpired(token);
    }

    resendRegistrationToken(data: any): any {
        return this._apiService.post(data, `resendRegistrationToken`);
    }

    getCurrencyValue(currency: any): any {
        let element = this._constantService.CURRENCY_SYMBOL_LIST.find((item: any) => item.key === currency);
        return element ? element.value : '£';
    }

    getCurrencyIcon(currency: any): any {
        let element = this._constantService.CURRENCY_SYMBOL_LIST.find((item: any) => item.key === currency);
        return element ? element.icon : 'monetization_on';
    }
}
