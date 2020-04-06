# Twitch ACM MMSys 2020 Grand Challenge Submission

Our submission Stallion (**STA**ndard **L**ow-**LA**tency v**I**deo c**ON**trol) uses
a sliding window to measure the mean and standard deviation of
both the bandwidth and latency to improve upon bandwidth and latency estimation.

## Contents
* **src** - The source code folder that contains all the modified dash.js code needed to implement Stallion.
* **low-latency** - The index.html and implementation of Stallion that is used by the dash.js player.
* src_logs - A source code folder containing extra documentation and log statements that can be used to see how the dash.js player is performing.

## Getting Started
1. Download and install the testing environment following instructions from https://github.com/twitchtv/acm-mmsys-2020-grand-challenge
2. Replace the src folder under dash.js/src with our src code folder.
3. Replace the low-latency folder under dash.js/samples/low-latency with our low-latency folder.

## Running a test

Run a test as normal as defined in the README.md ofhttps://github.com/twitchtv/acm-mmsys-2020-grand-challenge).

## Authors

* **Craig Gutterman**
* **Brian Fridman**
* **Trey Gilliland**
* **Yusheng Hu**
* **Gil Zussman**

## Contact

For any issues with running the code environment, email Trey at jlg2266@columbia.edu.
