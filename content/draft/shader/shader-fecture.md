---
title: "筆記 著色器的條件判斷與效果切換"
date: 
lastmod: 

draft: true

description:
tags: [unity, shader]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

<!--more-->

Unity 當中的著色器的條件判斷
https://docs.unity3d.com/Manual/shader-conditionals.html

著色器的條件判斷 沒有完美解

靜態分支 Static Branching
在進行編譯的同時完成條件判斷
通常是最好的選擇 好管理好優化 不會增加編譯成本 不會導致檔案過大 更不會有實時計算時的成本問題
唯一的缺點就是許多效果並不是能在編譯時判斷完成的 所以能解決的問題比較有限
例如 為特定硬體編譯的版本 只在編輯器狀態使用的效果
https://docs.unity3d.com/Manual/shader-branching.html#static-branching

動態分支 Dynamic Branching
在運行時執行條件判斷
最一般的 if else 判斷式
與 CPU 不同 GPU 不太擅長執行條件判斷
缺點是額外的計算成本 在不同的硬體上進行可能會有顯著的差異
GPU 必須為最壞的情況預留 空間
例如 一般需要條件判斷的情況...
最好的情況是 使用 uniform 變數 並且條件的所有分支成本相近 雖然是動態分支但整體的計算環境還是相較穩定的
或是
https://docs.unity3d.com/Manual/shader-branching.html#dynamic-branching


乘法計算
透過乘法開關效果
優點是 寫起來比較簡單？ 有時候條件剛好就是另一個動態數值 就直接用乘法開關
缺點是得將沒用到的也進行器算 並且可能沒那麼好維護 難讀
用數學解決問題 
例如 通常是特效類 距離場性質的計算 


變體著色器
透過靜態分支將著色器編譯出多個版本
製作只在編輯器用的特殊著色器


建置設定

ShaderVariantCollection 
Project Setting > Graphics > Shader Loading > Preloaded Shader 


深入研究這個問題
是因為遇到須要編寫開關效果的著色器


參考資料
變體著色器
https://docs.unity3d.com/Manual/shader-variant-collections.html


https://docs.unity3d.com/Manual/shader-keywords.html


https://docs.unity3d.com/Manual/SL-MultipleProgramVariants.html

https://zhuanlan.zhihu.com/p/190233160


https://chrislin1015.medium.com/unity%E6%89%8B%E6%9C%AD-multi-compile%E8%88%87shader-feature%E7%9A%84%E5%B7%AE%E7%95%B0-feat-materialpropertydrawer-241b61da2db8


Build 需要










