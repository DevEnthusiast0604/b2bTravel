import { Component } from '@angular/core';
import { config } from './shared/config/config';
import { ControlPanelService } from './views/admin/control-panel/control-panel.service';
import { ApiResponse } from './shared/interfaces/api-response.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = config.appName;

  constructor(
    private _controlPanelService: ControlPanelService
  ) {
    _controlPanelService.getControlPanel().then((response: ApiResponse) => {
      if (response.data) {
        _controlPanelService.dataControl.next(response.data);
      }
    });

    // console.log("Rounded value : ", this.roundNumber(2198767.878, 2));
    // console.log("Rounded value : ", this.roundNumber(549691.969, 2));
    // console.log("Rounded value : ", this.roundNumber(1597542.286, 2));
    // console.log("Rounded value : ", this.roundNumber(6390169.145, 2));

    // console.log("Rounded value : ", this.roundNumber(224975.995, 2));
    // console.log("Rounded value : ", this.roundNumber(56243.999, 2));
    // console.log("Rounded value : ", this.roundNumber(163459.121, 2));
    // console.log("Rounded value : ", this.roundNumber(653836.485, 2));

    //console.log("Rounded value : ", this.roundNumber(335958.786, 2));
    //console.log("Rounded value : ", this.roundNumber(83989.696, 2));
    let value: any = 244095.055658;
    value = value.toFixed(3);
    value = parseFloat(value);
    console.log("Rounded value : ", this.roundNumber(value, 2));
    //console.log("Rounded value : ", this.roundNumber(976380.221, 2));

    // // Rounding off 244095.055 to 244095.05
    // let number1 = 244095.055;
    // let roundedNumber1 = number1.toFixed(2);
    // console.log(roundedNumber1);

    // // Rounding off 335958.786 to 335958.79
    // let number2 = 335958.786;
    // let roundedNumber2 = number2.toFixed(2);
    // console.log(roundedNumber2);
  }

  roundNumber(value: any, decimalPlaces: any) {
    return value.toFixed(decimalPlaces);
    // const multiplier = 10 ** decimalPlaces;
    // const roundValue = value * multiplier;
    // const digitAfterDecimal = roundValue % 10;
    // if (digitAfterDecimal > 5) {
    //   value = Math.round(value * multiplier) / multiplier;
    // } else {
    //   value = Math.floor(roundValue) / multiplier;
    // }
    // return value;
  }
}
