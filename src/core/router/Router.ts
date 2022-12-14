import { TPreComponent } from '../component/models';
import { EventTargetWithLocation } from './models/types';
import { Route, TGuard } from './route/Route';

type TRoutes = Array<{
  path: string;
  view: TPreComponent;
  props?: Record<string, string>;
  guard?: TGuard;
}>;

export class Router {
  private static instance: Router;
  private routes: Route[] = [];
  private history = window.history;
  private currentRoute: Route | null = null;

  private constructor() {}

  private _getRoute(pathname: string) {
    const route = this.routes.find((route) => route.match(pathname));
    if (!route) {
      return this.routes.find((route) => route.match('/*'));
    }
    return route;
  }

  private _onRoute(pathname: string) {
    const route = this._getRoute(pathname);
    if (!route) return;
    if (this.currentRoute) this.currentRoute.destroy();
    this.currentRoute = route;
    this.currentRoute.render();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Router();
    }
    return this.instance;
  }

  public start() {
    window.addEventListener('popstate', (e: PopStateEvent) => {
      const { location } = e.target as EventTargetWithLocation;
      this._onRoute(location.pathname);
    });

    this._onRoute(window.location.pathname);
  }

  public go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  public registerRoutes(routes: TRoutes) {
    this.routes = routes.map((item) => new Route(item.path, item.view, item.props, item.guard));
  }
}
