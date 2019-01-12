import { TestBed, async } from '@angular/core/testing';
import { WebsiteComponent } from './website.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [WebsiteComponent]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(WebsiteComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'website'`, () => {
        const fixture = TestBed.createComponent(WebsiteComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('website');
    });

    it('should render title in a h1 tag', () => {
        const fixture = TestBed.createComponent(WebsiteComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain(
            'Welcome to website!'
        );
    });
});
