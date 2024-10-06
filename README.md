# Fleet Telemetry Dashboard

Cool application to show real time data from a fleet of 10 vehicles.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. ### Run the app

| Command     | Description      |
| ----------- | ---------------- |
| `npm start` | Runs in dev mode |
| `npm test`  | Runs Unit tests  |

## Approach

#### Data fetching and management

This project simulates real time data collection and visualization from a fleet. The initial data is read from a mock json and stored in a `Map` structure for performance reasons, since accessing a map value is `O(1)`.

Also, `reduxjs-toolkit` is used for state management and the initial fetch is done by an async action to already provide support to real API request.

#### Real time updates

To simulate the real time updates, a polling solution is used. Every 3 seconds, a random amount of vehicles is selected (at least one and at most all), for each vehicle also a random amount of data points (at least one and at most all) is selected to be randomly re-generated.

To not overload the main thread of the application, a worker is used to host this data update logic. The worker is intialized on the home component, and terminated when the component unmounts, to avoid memory leak.

#### Dashboard

The data is showed in a table shape on the `/` route. The table supports sorting my column, which is enabled by clicking on the column's header. Also, clicking on each row navigates to `/vehicle:vehicleId`

#### Notifications

There are safety thresholds defined under `/utils/constants` and when a vehicle exceeds any of these thresholds, a notification is generated. The notifications logic is re-checked every time the vehicles map is updated. To show the notifications there is a button rendered on the top bar of the home screen.

Notifications are based, groupped and counted by vehicle, meaning if there is only one vehiche with 7 notifications, the number showed in the button is 1. Clicking on notifications card also navigates to `/vehicle:vehicleId`. Although this screen already shows the notifications card when available.

## Tests

There are unit tests for the following logics

- Generate random values for each data point
- Table column's sorting
- Notifications generation
- Thresholds excesses

## Final Considerations

It's important to keep in mind that this project's working time was only a few hours, so I had to compromise in order to deliver a working MVP. Bellow is a list of topics I would have worked better with more time:

- Overall project: UI: Provide a more visual data representation, ploting charts at least for the most critical data points.
- Keeping record of data history, which would also be useful for plotting charts
- Generating random data more consistently and based on the previous values.
- Separating notifications between alerts and warnings and providing visual differentiation
- Alrady setup pagination support to future scaling up vehicles number
- Increase overall test coverage:

  - Assure that all components are rendered properly
  - Clicking events provide correct route redirection
  - Table sorting responds correctly on clicks
  - Correct styles are applied to critical values
