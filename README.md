# Twitch ACM MMSys 2020 Grand Challenge on Adaptation Algorithms for Near-Second Latency Submission

Our challenge submission Stallion (**STA**ndard **L**ow-**LA**tency v**I**deo c**ON**trol) uses
a sliding window to measure the mean and standard deviation of
both the bandwidth and latency to improve upon bandwidth and latency estimation.

Submission Links:
1. [Paper Submission](https://wimnet.ee.columbia.edu/wp-content/uploads/2020/06/stallion.pdf)
2. [Video Submission](https://www.youtube.com/watch?v=IKVdZxZanp4)
3. [Video Presentation Slides](https://wimnet.ee.columbia.edu/wp-content/uploads/2020/06/Stallion_twitch_challenge.pdf)

## About the Grand Challenge

"At Twitch, we have been successful in delivering ultra-low-latency streams to millions of viewers. However, as we drive towards near-second latency, we are finding that existing adaptation algorithms are not able to keep up - smaller player buffers do not provide enough time to respond to changing network conditions. We see this as a key challenge blocking the streaming community from reducing latency at scale. 

The purpose of this challenge is to design an adaptation algorithm tailored towards HTTP chunked transfer streaming in the near-second (1-2s) latency range. It should minimize rebuffering while maximizing bandwidth utilization given the considerations above. The algorithm must also be fair to other clients viewing the same stream - its performance should not come at the expense of another. The proposed algorithm must be implementable on the web and within an HTML5-based player." - MMSys '20 Grand Challenge Announcement

[Challenge description](https://2020.acmmmsys.org/lll_challenge.php)

[Challenge Github](https://github.com/twitchtv/acm-mmsys-2020-grand-challenge)

## Contents
* **src** - The source code folder that contains all the modified dash.js code needed to implement Stallion.
* **low-latency** - The index.html and implementation of Stallion that is used by the dash.js player.
* src_logs - A source code folder containing extra documentation and log statements that can be used to see how the dash.js player is performing.

## Getting Started
1. Download and install the testing environment by following instructions from [here.](https://github.com/twitchtv/acm-mmsys-2020-grand-challenge)
2. Replace the src folder under dash.js/src with our src code folder.
3. Replace the low-latency folder under dash.js/samples/low-latency with our low-latency folder.

## Running a test

Once setup following the steps above, tests can be ran as normal as defined in the README.md of the Challenge's [Github.](https://github.com/twitchtv/acm-mmsys-2020-grand-challenge)

## Authors

* **Craig Gutterman**
* **Brian Fridman**
* **Trey Gilliland**
* **Yusheng Hu**
* **Gil Zussman**

## Citation

Craig Gutterman, Brayn Fridman, Trey Gilliland, Yusheng Hu, Gil Zussman. 2020. STALLION: Video Adaptation Algorithm for Low-Latency Video Streaming. In 11th ACM Multimedia Systems Conference (MMSys’20), June 8–11, 2020, Istanbul, Turkey. ACM, New York, NY, USA, 7 pages. https://doi.org/10.1145/3339825.3397044

## Contact

For any issues with running the code environment, email Trey at jlg2266@columbia.edu.
