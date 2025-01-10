import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UserMaster } from 'src/app/Models/usermaster';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { RoleMaster } from 'src/app/Models/role-master'; 
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() data: UserMaster=new UserMaster();
  @Input() drawerVisible: boolean=false;
  
  isSpinning = false
  
  roles: RoleMaster[]=[];
  selectedRole:RoleMaster=new RoleMaster();
  constructor(private api: ClientmasterService, private message: NzNotificationService) {

  }

  ngOnInit() {
    this.selectedRole=new RoleMaster();
    this.loadRoles();
  }


  loadRoles() {
    this.isSpinning = true;
    this.api.getAllRoles(0,0,'','','').subscribe(roles => {
      this.roles = roles.data;
      this.isSpinning = false;
    }, err => {
      console.log(err);
      this.isSpinning = false;
    });
  }



  close(): void {
    this.drawerClose();
  }

save(addNew:boolean): void {
    this.isSpinning = true;
    if(this.data.NAME!=undefined && this.data.NAME!="")
    {
    if(this.data.ID)
    {
      this.api.updateUser(this.data)
      .subscribe(successCode => {
        if(successCode['code']=="200")
        {
            this.message.success("User Updated Successfully...", "");
            if(!addNew)
            this.drawerClose();
            this.isSpinning = false;
        }   
        else
        {
          this.message.error("User Updation Failed...", "");
          this.isSpinning = false;}
      });
    }
    else
    {
      
        this.api.createUser(this.data)
        .subscribe(successCode => {
          if(successCode['code']=="200")
          {
            this.message.success("User Created Successfully...", "");
             if(!addNew)
             this.drawerClose();
              else
              {
                this.data=new UserMaster();
              }
              this.isSpinning = false;
            }
             else
             {
              this.message.error("User Creation Failed...", "");
              this.isSpinning = false;
             }
            });
    }
  }
  else
  {
    this.message.error("Please Fill All Required Fields...","");
    this.isSpinning = false;
  }
  }

}
