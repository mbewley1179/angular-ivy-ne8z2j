import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  onLoadTF: boolean = false;
  newJobTicketTF: boolean = true;
  ticketNoValidTF: boolean = false;
  jobTickets: Array<IJobTicket> = [
    { id: 1, ticketNo: '8115' },
    { id: 2, ticketNo: '8116' },
    { id: 3, ticketNo: '8117' },
    { id: 4, ticketNo: '8118' },
    { id: 5, ticketNo: '8119' }
  ];
  defaultId: number = 0;
  ticketNo: string = '';
  jobTicketSelect: IJobTicket;
  jobTicketsMod: Array<IJobTicket> = [];
  gentleCorrection: string = '0 0 0 0.25rem rgba(220, 53, 69, 0.15)';
  jobTktValidTF: boolean = false;

  constructor(private cd: ChangeDetectorRef) {
    this.cd.detach();
  }

  ngOnInit() {
    this.jobTicketsMod.push(...this.jobTickets);
  }

  ngAfterContentChecked() {
    if (this.onLoadTF == true) {
      this.onLoadTF = false;
      this.changeUI(0);
    }
  }

  stageUIChanges(loc: number) {
    if (this.onLoadTF == false) {
      this.changeUI(loc);
    }
  }

  changeUI(loc: number) {
    setTimeout(() => {
      this.cd.detectChanges();
    }, 50);
  }

  handleJobTicket(event: IJobTicket, auto: boolean) {
    if (auto == false) {
      if (event != undefined) {
        this.jobTicketSelect = event;
        this.formTest();
      }
    }
  }

  filterJobTicket(value: string) {
    let jTModHold = this.deepCopy(this.jobTicketsMod);
    this.jobTicketsMod = this.jobTickets.filter(s =>
      s.ticketNo.toLowerCase().startsWith(value.toLowerCase())
    );
    if (value != undefined) {
      if (this.jobTicketsMod.length == 0 && value.length > 0) {
        this.ticketNo = this.inputValidator(value, '0-9');
        if (this.ticketNo.length < value.length) {
          this.jobTicketsMod = this.jobTickets.filter(s =>
            s.ticketNo.toLowerCase().startsWith(this.ticketNo.toLowerCase())
          );
          if (this.jobTicketsMod.length == 0) {
            this.newJobTicketTF = true;
            this.formTest2();
            setTimeout(() => {
              this.stageUIChanges(18);
            }, 200);
          }
          value = this.deepCopy(this.ticketNo);
        } else {
          this.newJobTicketTF = true;
          this.formTest2();
          setTimeout(() => {
            this.stageUIChanges(18);
          }, 200);
        }
      }
    }

    this.stageUIChanges(1);
  }

  formTest() {
    // Job Ticket
    if (this.jobTicketSelect.id != this.defaultId) {
      this.jobTktValidTF = true;
    } else {
      this.jobTktValidTF = false;
    }
    this.stageUIChanges(2);
  }

  formTest2() {
    console.log('formTest2(), this.ticketNo.length: ' + this.ticketNo.length);
    if (this.ticketNo.length > 0) {
      this.ticketNoValidTF = true;
    } else {
      this.ticketNoValidTF = false;
    }
  }

  public inputValidator(input: string, patternval: string) {
    let patternbuild = '^[' + patternval + ']*$';
    let patternbuild2 = '[^' + patternval + ']';
    let pattern = new RegExp(patternbuild);
    let inputprocess = input;
    console.log('inputprocess: ' + inputprocess);
    if (!pattern.test(input)) {
      inputprocess = input.replace(new RegExp(patternbuild2, 'g'), '');
      console.log('!pattern.test(input), inputprocess: ' + inputprocess);
    }
    return inputprocess;
  }

  deepCopy(input: any): any {
    return JSON.parse(JSON.stringify(input));
  }
}

export interface IJobTicket {
  id: number;
  ticketNo: string;
}
