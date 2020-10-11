window.BENCHMARK_DATA = {
  "lastUpdate": 1602427650445,
  "repoUrl": "https://github.com/RNGeek/rocketimer",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fc2eec0338ab88bc1e0256d732d5abbb12cf9f42",
          "message": "Merge pull request #130 from RNGeek/add-e2e-test\n\nヘッドレスブラウザを使った FPS のベンチマークを追加",
          "timestamp": "2020-10-11T21:56:30+09:00",
          "tree_id": "1d2e64282346cb5e2e2163e383530a4ce208f5fa",
          "url": "https://github.com/RNGeek/rocketimer/commit/fc2eec0338ab88bc1e0256d732d5abbb12cf9f42"
        },
        "date": 1602421214491,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "FPS during Countdowning",
            "value": 261.3143896061563,
            "range": "±2.35%",
            "unit": "fps",
            "extra": "10 samples"
          },
          {
            "name": "Render Time of TimerTimeline",
            "value": 1.5398428133332467,
            "range": "±11.61%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "Render Time of TimerRemainDisplay",
            "value": 1.5255041299999903,
            "range": "±14.16%",
            "unit": "ms/render",
            "extra": "300 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2984d8b8cae840d4e99e808d14a17113da42938d",
          "message": "Merge pull request #131 from RNGeek/improve-actions-cache\n\nactions/cache周りの整理",
          "timestamp": "2020-10-11T23:43:43+09:00",
          "tree_id": "2b890bb933a56be32eb7d5c9ab352a8bda466dd0",
          "url": "https://github.com/RNGeek/rocketimer/commit/2984d8b8cae840d4e99e808d14a17113da42938d"
        },
        "date": 1602427649940,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "FPS during Countdowning",
            "value": 321.71508042005905,
            "range": "±2.99%",
            "unit": "fps",
            "extra": "10 samples"
          },
          {
            "name": "Render Time of TimerTimeline",
            "value": 1.1698781933334794,
            "range": "±11.80%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "Render Time of TimerRemainDisplay",
            "value": 1.1035796166667509,
            "range": "±12.43%",
            "unit": "ms/render",
            "extra": "300 samples"
          }
        ]
      }
    ]
  }
}