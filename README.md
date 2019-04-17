<h1 align="center">
  <img src="./formal-vue.svg" width="128px" height="128px" /><br/>
  FormalVue
</h1>

> A straightforward, unopinionated and extendable way to manage your forms in VueJS.

## Formal Introduction

Choosing a form manager often comes down picking a compromise. Some enforce a specific markup incompatible with your design requirements, others promote patterns that may not be in line with your project's approach.

**FormalVue** is the sum of my experience dealing with forms and form managers in front-end frameworks. The main goal of this project is to offer an interface that simplifies the process of binding a form model and the various functions that manage it into the reactivity and event system in VueJS. All without asking you to make compromises in your code or your markup.

### What it *isn't*

First and foremost, this *is not a UI framework*. There are no components or stylesheets in order to maximise freedom of choice in your markup and stylesheets.

Furthermore, this *is not a utility library*. There are plenty of well-maintained libraries for handling common tasks like HTTP requests, validation or formatting. The challenge is binding these to the `v-model`.

That's where **FormalVue** comes in.

### Features

- **Declarative API**
- **Validation & formatting**
- **Computed and prefilled values**
- **Submit/Error handling**
- **Events and lifecycle hooks**
- **Field queries** (`isEmpty`, `isValid` and more )

## Getting started

### Installation

```bash
npm install formal-vue
# or
yarn add formal-vue
```

```javascript
// main.js
import FormalVue from 'formal-vue'
Vue.use(FormalVue)
```

### Getting started

Before digging in, take a look at this example to get a sense of how things will look.

###### `forms/UserRegistration.js`

```javascript
import { inputs } from 'formal-vue'
import { regex, format } from './helpers'

export default {
	name: 'UserRegistration',
	model: {
  	email: inputs.text.isRequired({
      validate: regex.email
    }),
    pass: inputs.text.isRequired(),
    confirmPass: inputs.text.isRequired({
      validate: ({ pass, confirmPass }) => pass === confirmPass,
      validateOnChange: true
    }),
    referralCode: inputs.text({
      format: format.referralCode,
      compute: ({ referralCode }) => referralCode.replace('-', '')
    }),
    userConsent: inputs.checkbox.isRequired()
  },

  submit(values) {
    return this.$http.post('register', values)
  }
}
```

###### `components/UserRegisterForm.vue`

```html
<template>
  <form @submit="$form.onSubmit">
    <h1>{title}</h1>

    <label for="email">Email</label>
    <input id="email" v-model="$form.model.email.value" type="text" />

    <label for="pass">Password</label>
    <input id="pass" v-model="$form.model.pass.value" type="password" />

    <label for="confirm">Confirm password</label>
    <input id="confirm" v-model="$form.model.confirmPass.value" type="password" />

    <label for="referral">Referral code</label>
    <input id="referral" v-model="$form.model.referralCode.value" type="text" />

    <label>
      <input v-model="$form.model.userConsent.value" type="checkbox" />
      Accept terms and conditions
    </label>

    <button type="submit">Submit</button>
  </form>
</template>

<script>
import UserRegistration from '@/forms/userRegistration'

export default {
  name: 'UserRegisterForm',
  props: { title: String },
  form: UserRegistration
}
</script>
```

## Development

### Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Run your unit tests

```
yarn run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
