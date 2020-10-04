window.BENCHMARK_DATA = {
  "lastUpdate": 1601811256879,
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "19e6fac589763f675b9dc9a8691a79f379c10b43",
          "message": "誤差範囲を表示する",
          "timestamp": "2020-10-02T01:31:24+09:00",
          "tree_id": "6375260c2f261abfef21a5b49f336ea102b37d3a",
          "url": "https://github.com/RNGeek/rocketimer/commit/19e6fac589763f675b9dc9a8691a79f379c10b43"
        },
        "date": 1601570067928,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.0508611999999813,
            "range": "±3.51%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.9323755199999141,
            "range": "±3.59%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "ddd3acccd65d361f459c627fd4f6eca1042b9f7b",
          "message": "performance だと名前から実態が予想しづらいので rename",
          "timestamp": "2020-10-02T01:35:53+09:00",
          "tree_id": "74ead9f33e535f62b02d9ddf4a323ed75ab2b416",
          "url": "https://github.com/RNGeek/rocketimer/commit/ddd3acccd65d361f459c627fd4f6eca1042b9f7b"
        },
        "date": 1601570196756,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.3329768700000477,
            "range": "±7.85%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.173396130000101,
            "range": "±7.11%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "4525b3c33e51515f121ec55abc81ef4bd0f483e7",
          "message": "リファクタリング",
          "timestamp": "2020-10-02T01:37:41+09:00",
          "tree_id": "b7fe4fbb2fa324811d0f5de858ca2a0200973b3a",
          "url": "https://github.com/RNGeek/rocketimer/commit/4525b3c33e51515f121ec55abc81ef4bd0f483e7"
        },
        "date": 1601570449697,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.1037324200000602,
            "range": "±8.07%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.9647932700000456,
            "range": "±8.19%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "02161784a0689a7121f2aa2cc825c949eefb5aab",
          "message": "github-action-benchmark  でアラートも上げてくれるようになったので、jest で assert する必要はなくなった",
          "timestamp": "2020-10-02T01:45:16+09:00",
          "tree_id": "8b1a08630e3511219c3feb6d973c2c6c53d6a0fb",
          "url": "https://github.com/RNGeek/rocketimer/commit/02161784a0689a7121f2aa2cc825c949eefb5aab"
        },
        "date": 1601570756447,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.5239222799999335,
            "range": "±15.68%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.3701833500001521,
            "range": "±17.27%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "57915901741f99b1a8d6d919703069de56804d22",
          "message": "実際の測定結果を見ると波があって 150% だと何もしていない時にもアラートが上がりそうなので、しきい値を上げてみる",
          "timestamp": "2020-10-02T01:47:54+09:00",
          "tree_id": "11587997e7932a3076201248c1a64f42711c05c1",
          "url": "https://github.com/RNGeek/rocketimer/commit/57915901741f99b1a8d6d919703069de56804d22"
        },
        "date": 1601570917689,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.1050677700000142,
            "range": "±5.16%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.9809197000000132,
            "range": "±5.58%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "d405164b3b70b7feed9b037ab3c578b71cca480d",
          "message": "master に対応させる",
          "timestamp": "2020-10-02T01:49:33+09:00",
          "tree_id": "e33ff816a759f4c44e82345f5affa307bbc86020",
          "url": "https://github.com/RNGeek/rocketimer/commit/d405164b3b70b7feed9b037ab3c578b71cca480d"
        },
        "date": 1601571022478,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.5565865500000473,
            "range": "±17.36%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.4214521500000683,
            "range": "±18.96%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "09189c551ba816761c93dfbf8772588001a07181",
          "message": "リファクタリング",
          "timestamp": "2020-10-02T01:57:21+09:00",
          "tree_id": "4661e08b525c6686f7fa8f60a53927eb03d1d938",
          "url": "https://github.com/RNGeek/rocketimer/commit/09189c551ba816761c93dfbf8772588001a07181"
        },
        "date": 1601571480012,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.0198253600000227,
            "range": "±3.90%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.8946433200000229,
            "range": "±3.71%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "a624aab83cfafb292f966043e018e38e6b6d430c",
          "message": "リファクタリング",
          "timestamp": "2020-10-03T01:03:19+09:00",
          "tree_id": "b8bfdb7caef41eacbd73bd3b7d2aefee46eece7c",
          "url": "https://github.com/RNGeek/rocketimer/commit/a624aab83cfafb292f966043e018e38e6b6d430c"
        },
        "date": 1601654673863,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.2934380000000418,
            "range": "±8.61%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.159975099999956,
            "range": "±9.52%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "a7feb81de27d1d5bbcd6555ca599ca3e6ad67ff9",
          "message": "コメントを更新",
          "timestamp": "2020-10-03T01:20:09+09:00",
          "tree_id": "2f58dbfbc9145bd92cadd9da3320d0bf861221af",
          "url": "https://github.com/RNGeek/rocketimer/commit/a7feb81de27d1d5bbcd6555ca599ca3e6ad67ff9"
        },
        "date": 1601655665011,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.184666130000005,
            "range": "±5.88%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.039229370000012,
            "range": "±5.24%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "57dadac70573c1f79b08380d77a2f07ceb929c7c",
          "message": "コメントをアップデート",
          "timestamp": "2020-10-03T02:03:16+09:00",
          "tree_id": "f76eef4e1ee1b0a7c0c694da47ea96df4e1fdccd",
          "url": "https://github.com/RNGeek/rocketimer/commit/57dadac70573c1f79b08380d77a2f07ceb929c7c"
        },
        "date": 1601658247070,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.3243895100000465,
            "range": "±7.09%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.1782366400000137,
            "range": "±7.87%",
            "unit": "ms/render",
            "extra": "100 samples"
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "9efbfeefae2525ec127ce6d2bcda675e9047a926",
          "message": "コメントをアップデート",
          "timestamp": "2020-10-03T02:04:02+09:00",
          "tree_id": "f33cb542d8e2590970babf030e96dade2e59f50d",
          "url": "https://github.com/RNGeek/rocketimer/commit/9efbfeefae2525ec127ce6d2bcda675e9047a926"
        },
        "date": 1601658291527,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.3373861399999987,
            "range": "±7.69%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.1841497399998844,
            "range": "±8.36%",
            "unit": "ms/render",
            "extra": "100 samples"
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
          "id": "10970955cbdae0cbb80771e18283f8ff09530c6c",
          "message": "Merge pull request #106 from RNGeek/add-github-action-benchmark\n\ngithub-action-benchmark で FPS の変化を監視する",
          "timestamp": "2020-10-03T02:09:59+09:00",
          "tree_id": "24b23a7626d954fde95d223bb062ac311c746f03",
          "url": "https://github.com/RNGeek/rocketimer/commit/10970955cbdae0cbb80771e18283f8ff09530c6c"
        },
        "date": 1601658683265,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.058891120000044,
            "range": "±13.12%",
            "unit": "ms/render",
            "extra": "100 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.8867518799999925,
            "range": "±15.62%",
            "unit": "ms/render",
            "extra": "100 samples"
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
          "id": "32a4abfad974c968448e2ac83243553ec15aee29",
          "message": "Merge pull request #107 from RNGeek/tuning-benchmark\n\nベンチマークの信頼区間がより小さくなるように",
          "timestamp": "2020-10-03T15:14:50+09:00",
          "tree_id": "16c196e846ec8a932db23eb29ea7644b248e3713",
          "url": "https://github.com/RNGeek/rocketimer/commit/32a4abfad974c968448e2ac83243553ec15aee29"
        },
        "date": 1601705755854,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.1666319866665495,
            "range": "±14.35%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.9789161033332857,
            "range": "±17.03%",
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
          "id": "8a6f74436017ada0d819f0b2c6627d80ce5be157",
          "message": "Merge pull request #108 from RNGeek/tuning-konva\n\nタイムラインのパフォーマンスチューニング",
          "timestamp": "2020-10-03T16:14:37+09:00",
          "tree_id": "60dfafdf2d9765a33229c93630b7d3755952111b",
          "url": "https://github.com/RNGeek/rocketimer/commit/8a6f74436017ada0d819f0b2c6627d80ce5be157"
        },
        "date": 1601709356263,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.1326770100000492,
            "range": "±9.80%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.9344494466667432,
            "range": "±11.80%",
            "unit": "ms/render",
            "extra": "300 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "30342490+mergecat[bot]@users.noreply.github.com",
            "name": "mergecat[bot]",
            "username": "mergecat[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bac1bb00cc7b6a5931c08d70b352769ead11b1a2",
          "message": "Merge pull request #111 from RNGeek/tuning-update-timing",
          "timestamp": "2020-10-04T09:35:22Z",
          "tree_id": "ceb34f92b49e204cafe32cf5bef3c0ffe0c8f8fd",
          "url": "https://github.com/RNGeek/rocketimer/commit/bac1bb00cc7b6a5931c08d70b352769ead11b1a2"
        },
        "date": 1601804189917,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 0.9875061466667163,
            "range": "±6.38%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.933997590000084,
            "range": "±6.58%",
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
          "id": "edac55064da0807f3325123ac413bfd502d668c0",
          "message": "Merge pull request #112 from RNGeek/fix-bugs\n\n細かいバグを修正",
          "timestamp": "2020-10-04T19:14:24+09:00",
          "tree_id": "a748184da4cc4a23c329e59e2d71c67304377259",
          "url": "https://github.com/RNGeek/rocketimer/commit/edac55064da0807f3325123ac413bfd502d668c0"
        },
        "date": 1601806588404,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.3098703466665271,
            "range": "±13.41%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.198984916666759,
            "range": "±11.55%",
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
          "id": "5c36f062e8a29faf55311de159512607df5a4830",
          "message": "Merge pull request #113 from RNGeek/support-test-coverage\n\nテストカバレッジを取る",
          "timestamp": "2020-10-04T19:57:37+09:00",
          "tree_id": "38be9a3733841f8ef86747dfd596441c0cdd7256",
          "url": "https://github.com/RNGeek/rocketimer/commit/5c36f062e8a29faf55311de159512607df5a4830"
        },
        "date": 1601809137676,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.357582366666429,
            "range": "±11.54%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.2785899333331812,
            "range": "±12.14%",
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
            "email": "pp.mizdra@gmail.com",
            "name": "mizdra",
            "username": "mizdra"
          },
          "distinct": true,
          "id": "34676a5184f0874bd6837315a5cd870c42d63190",
          "message": "ベンチマークの URL を README に追加",
          "timestamp": "2020-10-04T20:11:19+09:00",
          "tree_id": "1cba2ce92a3c85d8a78a1d2d16df87eb4c100885",
          "url": "https://github.com/RNGeek/rocketimer/commit/34676a5184f0874bd6837315a5cd870c42d63190"
        },
        "date": 1601809946171,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.0301966300000398,
            "range": "±9.65%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.9720889933334426,
            "range": "±10.21%",
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
          "id": "4712bf8a6778ed6d3b6da8dab33f3662ced69d62",
          "message": "Merge pull request #114 from RNGeek/add-renovate\n\nrenovate を導入",
          "timestamp": "2020-10-04T20:19:09+09:00",
          "tree_id": "55f48153f21546155eadc1ea5d4b1ce9c9338b67",
          "url": "https://github.com/RNGeek/rocketimer/commit/4712bf8a6778ed6d3b6da8dab33f3662ced69d62"
        },
        "date": 1601810425004,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.1799059366664126,
            "range": "±10.05%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.080009589999839,
            "range": "±10.07%",
            "unit": "ms/render",
            "extra": "300 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "1392fae3ea8056131b2a9d6b19388342a31cfb41",
          "message": "Update babel monorepo to ^7.10.4",
          "timestamp": "2020-10-04T11:30:56Z",
          "tree_id": "5a5a4c2e663db7ce7c4a1e86756513a6953b9046",
          "url": "https://github.com/RNGeek/rocketimer/commit/1392fae3ea8056131b2a9d6b19388342a31cfb41"
        },
        "date": 1601811179974,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.0157534899998608,
            "range": "±7.61%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 0.9627998133332403,
            "range": "±7.91%",
            "unit": "ms/render",
            "extra": "300 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "2f5b30f1aa62045ff81addceea54e7202b817e87",
          "message": "Update dependency @types/react to ^16.9.50",
          "timestamp": "2020-10-04T11:31:59Z",
          "tree_id": "581a2b6bd7646c2ddbe51cb1a78773f2e6a28c8d",
          "url": "https://github.com/RNGeek/rocketimer/commit/2f5b30f1aa62045ff81addceea54e7202b817e87"
        },
        "date": 1601811256401,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "TimerTimeline",
            "value": 1.2308252433332867,
            "range": "±5.02%",
            "unit": "ms/render",
            "extra": "300 samples"
          },
          {
            "name": "TimerRemainDisplay",
            "value": 1.1817926033331787,
            "range": "±6.76%",
            "unit": "ms/render",
            "extra": "300 samples"
          }
        ]
      }
    ]
  }
}