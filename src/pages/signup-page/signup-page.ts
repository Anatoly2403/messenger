import './signup-page.scss';
import { ISignupData } from '../../models/user/interfaces';
import { Form } from '../../components/form/form';
import { validatePassword, validateLogin, validateEmail, validateName, validatePhone } from '../../utils';
import { TInputFieldProps } from '../../ui-kit/input-field';
import { TButtonProps } from '../../ui-kit/button';
import { TLinkProps } from '../../core/router/components/link';
import { prepareComponent } from '../../core/component';
import { ISimpleObject } from '../../core/models';
import { userService } from '../../services/user-service';

type TSignupPageState = {
  fields: TInputFieldProps[];
  button: TButtonProps;
  link: TLinkProps;
};

function onSubmit(data: ISignupData) {
  userService.signup(data);
}

const template = `
    <div class="signup-page">
      <div class="signup-page-form__wrapper">
        {{{ 
          form 
            onSubmit=helpers.onSubmit
            title="Вход" 
            fields=state.fields 
            button=state.button
            link=state.link
        }}}
      </div>  
    </div>
  `;

export const SignupPage = prepareComponent<ISimpleObject, TSignupPageState>({
  name: 'signup-page',
  template,
  children: [Form],
  helpers: { onSubmit },
  state: {
    fields: [
      {
        type: 'inputField',
        name: 'email',
        label: 'Почта',
        validators: [validateEmail],
        errorText: 'Неверная почта',
      },
      {
        type: 'inputField',
        name: 'login',
        label: 'Логин',
        validators: [validateLogin],
        errorText: 'Неверный логин',
      },
      {
        type: 'inputField',
        name: 'first_name',
        label: 'Имя',
        validators: [validateName],
        errorText: 'Некорректно введено имя',
      },
      {
        type: 'inputField',
        name: 'second_name',
        label: 'Фамилия',
        validators: [validateName],
        errorText: 'Некорректно введена фамилия',
      },
      { type: 'inputField', name: 'phone', label: 'Телефон', validators: [validatePhone], errorText: 'Неверный номер' },
      {
        type: 'inputField',
        name: 'password',
        label: 'Пароль',
        fieldType: 'password',
        validators: [validatePassword],
        errorText: 'Неверный пароль',
      },
    ],
    button: {
      type: 'submit',
      label: 'Зарегистрироваться',
    },
    link: {
      href: '/login',
      label: 'Войти',
    },
  },
});
