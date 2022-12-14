import { UserApi } from '../../api/user-api';
import { redirect } from './../../core/router';
import { IChatUser, IPasswordData, IProfileData, isError, ISigninData, ISignupData, IUserData } from '../../models';
import { store } from '../../store';
import { showError } from '../../core/error';

class UserService {
  private api = new UserApi();

  public async login(data: ISigninData) {
    try {
      await this.api.signin(data);
      await this.getUserData();
      redirect('/');
    } catch (e) {
      if (isError(e)) showError(e.reason);
    }
  }

  public async signup(data: ISignupData) {
    try {
      await this.api.signup<IUserData>(data);
      await this.getUserData();
      redirect('/');
    } catch (e) {
      if (isError(e)) showError(e.reason);
    }
  }

  public async logout() {
    try {
      await this.api.logout();
      store.setState({ user: null });
      redirect('/login');
    } catch (e) {
      if (isError(e)) showError(e.reason);
    }
  }

  public async getUserData() {
    try {
      const userInfo = await this.api.info<IUserData>();
      store.setState({ user: userInfo, userId: userInfo.id });
    } catch (e) {
      if (isError(e)) showError(e.reason);
      redirect('/login');
    }
  }
  public async updateProfileData(data: IProfileData) {
    try {
      const userInfo = await this.api.updateData<IUserData>(data);
      store.setState({ user: userInfo });
    } catch (e) {
      if (isError(e)) showError(e.reason);
    }
  }

  public async updatePassword(data: IPasswordData) {
    try {
      await this.api.updatePassword(data);
    } catch (e) {
      if (isError(e)) showError(e.reason);
    }
  }

  public async updateAvatar(data: FormData) {
    try {
      const userInfo = await this.api.updateAvatar<IUserData>(data);
      store.setState({ user: userInfo });
    } catch (e) {
      if (isError(e)) showError(e.reason);
    }
  }

  public async getUserByLogin(login: string) {
    try {
      const users = await this.api.getUser<IChatUser[]>(login);
      store.setState({ foundUsers: users });
    } catch (e) {
      if (isError(e)) showError(e.reason);
    }
  }

  public removeFoundUsers() {
    store.setState({ foundUsers: [] });
  }
}

type TUserService = typeof UserService;
const userService = new UserService();

export { userService, TUserService };
