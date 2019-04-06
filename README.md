<h1 style="text-align:center">
	<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 500 500">
	  <path fill="#64b687" d="M0 0h500v500H0z"/>
  	<path fill="#39485c" d="M219 226.8v51c-49.7 43.1-107.2 45.7-107.2 45.7-35.3-51 0-147.7 0-147.7s41.9 5.3 107.2 51zm54.2 0v51c49.7 43.1 107.2 45.7 107.2 45.7 35.3-51 0-147.7 0-147.7s-41.9 5.3-107.2 51zM258.3 279h-24.5c-3.3 0-6-2.7-6-6v-42c0-3.3 2.7-6 6-6h24.5c3.3 0 6 2.7 6 6v42c0 3.3-2.7 6-6 6z"/>
	</svg>
  <br/>
  FormalVue
</h1>

> A straightforward, unopinionated and extendable form manager for VueJS.

## Introduction

Choosing a form manager often comes down picking a compromise. Some enforce a specific markup incompatible with your design requirements, others promote patterns that may not be in line with your team's or project's approach.

**FormalVue** is the sum of my experience dealing with forms and form managers in front-end frameworks. The main goal of this project is to offer an interface that simplifies the process of binding a form model and the various functions that manage it into the reactivity and event system in VueJS. All without asking you to make compromises in your code or your markup.

### What it *isn't*

First and foremost, this *is not a UI framework*. There are no components in order to maximise compatibility with your UI framework of choice or to allow complete freedom in the shape of your DOM.

Furthermore, this *is not a utility library*. There are plenty of well-built, well-maintained HTTP request solutions or validation and formatting helpers for you to choose from. The challenge is tying these into events and the `v-model`, hassle free.

That's where **FormalVue** comes in.

### Features

- **Familiar interface**: mirroring Vue's component API, defining a form feels natural and intuitive.
- **Composition freedom**: define forms in components or their own files, shape the model to your needs.
- **Validation observers**: require fields and apply validators on change or before submit.
- **Formatting observers**: seamlessly format UI output without losing the original values.
- **Transformers and computed values**: transform or add computed fields to the form's output.
- **Events and lifecycle hooks**: subscribe to events through Vue's event API or define lifecycle hooks.
- **Submit and error handling**: validation is done before submit is called and errors are propagated.
- **Individual field helpers**: common queries, such as `isEmpty` or `isValid`, are automatically generated.

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

### Basic usage

The most basic way of defining a form is to define it inline in your component.

```html
<template>
	<form @submit="$form.onSubmit">
    <label for="email">Email</label>
   	<input id="email" v-model="$form.model.email.value" type="text" />

		<label for="password">Password</label>
   	<input id="password" v-model="$form.model.password.value" type="password" />

    <label for="confirm">Confirm password</label>
    <input id="confirm" v-model="$form.model.confirmPassword.value" type="password" />

    <label for="referral">Referral code</label>
    <input id="referral" v-model="$form.model.referralCode.value" type="text" />

    <label>
      <input v-model="$form.model.acceptConditions.value" type="checkbox" />
      Accept conditions
    </label>

    <button type="submit">Submit</button>
  </form>
</template>

<script>
import { inputs } from 'formal-vue'
import { regex, format } from './helpers'

Vue.component({
  name: 'RegisterForm',
  form: {
    name: 'Registration',
    model: {
      email: inputs.text.isRequired({ 
        validate: regex.email
      }),
      password: inputs.text.isRequired({ 
      	validate: ({ password }) => regex.password.test(password) && password.length > 5
  		}),
      confirmPassword: inputs.text.isRequired({
        validate: ({ password, confirmPassword }) => password === confirmPassword,
        validateOnChange: true
      }),
      referralCode: inputs.text({
        format: format.referralCode,
        preserveOriginal: true
      })
    }
  }
})
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
