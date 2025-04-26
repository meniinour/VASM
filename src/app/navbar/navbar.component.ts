import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { ROUTES } from "../documentation/documentation.component";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from "@angular/platform-browser";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [BrowserModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private listTitles: any[] | undefined;
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;

  public isCollapsed = true;
  closeResult: string | undefined;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }

  // Fonction qui ajoute la couleur blanche/transparente à la navbar lors du redimensionnement (pour la gestion du collapse)
  updateColor = () => {
    var navbar = document.getElementsByClassName('navbar')[0];
    if (window.innerWidth < 993 && !this.isCollapsed) {
      navbar.classList.add('bg-white');
      navbar.classList.remove('navbar-transparent');
    } else {
      navbar.classList.remove('bg-white');
      navbar.classList.add('navbar-transparent');
    }
  };

  ngOnInit() {
    window.addEventListener("resize", this.updateColor);
    this.listTitles = ROUTES.filter((listTitle: any) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe(event => {
      this.sidebarClose();
      var $layer: HTMLElement = document.getElementsByClassName("close-layer")[0] as HTMLElement;
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName("nav")[0];
    if (!this.isCollapsed) {
      navbar.classList.remove("navbar-transparent");
      navbar.classList.add("bg-white");
    } else {
      navbar.classList.add("navbar-transparent");
      navbar.classList.remove("bg-white");
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = <HTMLElement>document.getElementsByClassName("main-panel")[0];
    const html = document.getElementsByTagName("html")[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = "fixed";
    }

    setTimeout(() => {
      toggleButton.classList.add("toggled");
    }, 500);

    html.classList.add("nav-open");
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    this.toggleButton.classList.remove("toggled");
    const mainPanel = <HTMLElement>document.getElementsByClassName("main-panel")[0];

    if (window.innerWidth < 991) {
      setTimeout(() => {
        mainPanel.style.position = "";
      }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove("nav-open");
  }

  sidebarToggle() {
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];
    const html = document.getElementsByTagName("html")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }

    if (this.mobile_menu_visible == 1) {
      html.classList.remove("nav-open");
      var $layer: Element = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
      }
      setTimeout(() => {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(() => {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer: Element = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (html.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (html.classList.contains("off-canvas-sidebar")) {
        document.getElementsByClassName("wrapper-full-page")[0].appendChild($layer);
      }

      setTimeout(() => {
        $layer.classList.add("visible");
      }, 100);

      ($layer as HTMLElement).onclick = () => {
        html.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(() => {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      };

      html.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  getTitle(): string {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    
    if (titlee.startsWith("#")) {
      titlee = titlee.slice(1);
    }
  
    if (this.listTitles) {
      for (const item of this.listTitles) {
        if (item.path === titlee) {
          return item.title || 'default title';
        }
      }
    }
  
    return "home";
  }
  

  open(content: any) {
    this.modalService.open(content, { windowClass: 'modal-search' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.updateColor);
  }
}
