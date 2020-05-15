# MyPostsApp
Technical test for Founders Workshop

Structure:
This project is divided by components, this means that the two JS files are located inside src/components:

index.js
App.js
|__ src
    |__ components
        |__ AppContainer.js
        |__ ListFeed.js

In order to excecute the project once is cloned, you have to:
cd MyPostsApp
npm install
yarn

/*Extra steps for ios*/
cd ios
pod install

When everything has finished running:
/*Android*/
react-native run-android
/*iOS*/
open the .xcodeworkspace in Xcode and run in a selected device

The required version for the Android simulator is:
API 28

For iOS:
Any iPhone that comes in Xcode 11

• Please explain why did you decide to use React Native Cli or Expo?
I decided to use react native Cli because in my 2 years of experience the projects that I've contributed were built using react native Cli, also, I had everything setted.

• Did you use a npm library to manage offline data storage?
I used @react-native-community/async-storage

• Why do you think this option is the best vs alternatives?
I think that's the best option because the data that I wanted to store wasn't too large, and I think it's faster against it's competitors.

• Please explain why did you decide to use this UI Components vs alternatives?
Native base is the most complete library, also, this library have a really good documentation. Native base imitates the native UI components for both platforms, so it looks like it's a native application.

• Why unit tests are important for a project?
Using unit tests in a project could be beneficial to the code quality, because when you are running your tests you can identify the weak points on your code and you can see when your code can be redundant; if you have a good quality in your code, process like debugging and changes in the code can be so much eaiser.

• Why did you decide to use this unit test library for a react native project?
Is the library in wich I have some experience and I it's the one I felt most comfortable with.

• What other libraries you had to use to accomplish the project?
I used display, moment, image-picker, geolocation-service, maps and modal.

• What was the most difficult to accomplish? please share your experience.
I could say that unit testing was the most challenging for me, because even I used the library that I've already worked with, I couldn't figured out how to make some unit testings works, I can say that that's the weakest part in my project; also, working with geolocation and maps was laborious for me, I had never used that libraries.

• How much time did you spend building this test?
I spent about 6 and a half days working between 8 and 11 hours, approximately 68 hours.

Thanks for the opportunity, even if this is not the best code I really enjoyed and learned working on it.
