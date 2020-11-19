# Iframily

Iframily is a tiny (zero dependency) library which modernizes IFrames communication.

This is how it works:

1. Create framilies in the parent frame.
2. Create framilies in the child frame.
3. If a parent id and child id match, they will pair.
4. Send messages between paired framilies.

## Features

* Works with cross domain IFrames.
* Send any serializable message.
* Support sync and async responses (Promise based).
* Queue messages sent until pairing has completed.

## How do I get set up

```shell
npm i iframily --save
```

You can also add the library via script tag and use `window.Iframily`:

```html
<head>
    <script src="https://raw.githubusercontent.com/asimen1/ext-messenger/master/dist/ext-messenger.min.js"></script>
</head>

<body>
    <script>
        let Iframily = window.Iframily;
    </script>
</body>
```

MY TODO: replace with real link for script tag...

## API

### Iframily singleton

Iframily is a singleton and will allow you to initialize parent/child [iframily instances](#iframily-instance).

#### Iframily.initParent(id, msgHandler, options) -> `iframily instance`

#### Iframily.initChild(id, msgHandler, options) -> `iframily instance`

Creates a parent/child [iframily instance](#iframily-instance) respectively (to be used in the parent/child frame) and returns it, if successful.

| Param           | Type           | Description  |
| :-------------: |:--------------:| :------------|
| id | `string` | A unique id to identify this [iframily instance](#iframily-instance), this is used in order to match parent and child framilies. Will abort and log an error if the id already exists in the current frame. |
| msgHandler | `function` | Optional - A handler for incoming messages from the paired iframily in the parent/child frame. The `msgHandler` can return back a response value or a promise that will be resolved/rejected with a response value.  |
| options | `object` | Optional - Additional options, see possible options below: |
| options.onPairedHandler | `function` | Optional - A handler that will be invoked upon pairing. |
| options.onDisposedHandler | `function` | Optional - A handler that will be invoked when the instance is disposed. |
| options.targetOrigin | `URI` | Optional - The URI to use as the target origin for the `postMessage` call. Use this if you are passing sensitive data, see [link](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for more info. Default is '*'.|

#### Iframily.isIframilyMessage(event) -> `boolean`

If you manually listen to messages using the window ["message" event](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#The_dispatched_event) you will also receive internal iframily messages. This method will return `true` for this events so you can easily identify them.

```javascript
window.addEventListener("message", receiveMessage);

function receiveMessage(event) {
    // Ignore iframily messages.
    if (Iframily.isIframilyMessage(event)) {
        return;
    }

    // Handle other messages below:
    // ...
}
```

### Iframily instance

The iframily instance is the object returned when initing a new connecter using the `initParent()` or `initChild()` methods.

#### f.sendMessage(msg) -> `Promise`

| Param           | Type           | Description  |
| :-------------: |:--------------:| :------------|
| msg             | `serializable` | The message to be sent, can be any serializable (see [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)).

Returns a promise that will be resolved with the response value from the receiving iframily instance message handler. The promise will be rejected if the receiving iframily instance returned a rejected promise.

> if the receiving iframily instance did not return an explicit response value in its message handler, the promise will be resolved with `undefined`.

#### f.dispose()

Dispose of the iframily instance, making it obsolete.

> * You cannot reuse a disposed instance, you can however create a new instance with the same id.
> * Any framilies paired with this instance will still keep sending messages to the disposed instance but they will be ignored.

This method is useful when you have a parent frame which recreates the same child frame and you want to use the same id for the framilies.

#### f.disposed -> `boolean` (read only)

Returns `true` if this iframily instance has been disposed.

#### f.id -> `string` (read only)

Returns the id that this iframily was inited with.

## Usage example

```javascript
// -------------------------
// In the parent frame.
// -------------------------
const Iframily = require('iframily');

let msgHandler = function(msg)
    console.log('parent got message:', msg);
};

let parent = Iframily.initParent('myUniqueId', msgHandler);

parent.sendMessage('do something')
    .then((response) => {
        console.log('parent got response:', response);
    });

parent.sendMessage('do something async')
    .then((response) => {
        console.log('parent got async response:', response);
    });
```

```javascript
// -------------------------
// In the child frame.
// -------------------------
const Iframily = require('iframily');

let msgHandler = function(msg) {
    console.log('child got message:', msg);

    if (msg === 'do something') {
        return 'OK! done!';
    } else if (msg === 'do something async') {
        return new Promise((resolve, reject) => {
            resolve('OK! done async!');
        });
    }
};

let child = Iframily.initChild('myUniqueId', msgHandler);

child.sendMessage({ text: 'fancy' });
```

* Your unique id (`myUniqueId` in the example) should match between parent and child.

## Notes

* You can create multiple framilies in each frame but the unique ids cannot be used more than once per frame (unless the previous one has been disposed).
* Parent can connect to one child only and vice versa (due to previous note).
* Designed for modern browsers (IE not supported).

## Contributing

* `npm run dev` - builds unuglified bundle and watches for changes.
* `npm run playground` - launch a simple page with a parent and child frame framilies to manually test out stuff.
* Please make all push requests against the `develop` branch.
* Please update/add tests coverage.
* Pay attention to linting (they will fail the production bundle build).
* `npm run test` - run tests.
  * `npm run test-debug-mac` or `npm run test-debug-win` for debugging the tests.
  * Tests run against the built bundle, so make sure your changes are built before running.
  * Tests require a modification in your hosts file (see note below).

Running tests require `node >=10` and modifying your hosts file like so:

```text
# iframily
127.0.0.1   sub1.domain1iframily.com
127.0.0.1   sub2.domain2iframily.com
```

When your done developing, make sure to run the production build via `npm run build` so the correct bundle will be committed to the `dist` folder.