window.BENCHMARK_DATA = {
  "lastUpdate": 1601570918171,
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
      }
    ]
  }
}