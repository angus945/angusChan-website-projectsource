---
title: "Event"
date: 2019-12-24
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

>-----無輸入event-----<

>-基本-<
建立基本的無輸入event
public event Action NotInputEvent;

註冊事件
NotInputEvent += FunctionA; (void FunctionA() { print("A"); })
NotInputEvent += FunctionB; (void FunctionB() { print("B"); })
NotInputEvent += FunctionC; (void FunctionC() { print("C"); })

<!--more-->

取消註冊
NotInputEvent -= FunctionC;

觸發事件
NotInputEvent.Invoke();

當事件觸發時，被註冊進event的function都會受到調用
當前情況為 Print出 A,B
而FunctionC 因為被取消註冊所以沒受到調用(print("C");)

>-實際情況、運用-<
以彈珠台舉例

建立event -
public event Action OnGame
OnGame += LoadSceneObject;
OnGame += SpawnMarbles;

Function(不同腳本) -
載入場景物件
void LoadSceneObject() { loadSceneObject....; OnGame -= LoadSceneObject; }

重生出彈珠   
void SpawnMarbles() { spawnMarbles....};

情況 -
當第一次進入遊戲時 OnGame.Invoke();
載入場景物件、重生出彈珠

當玩家死亡 OnGame.Invoke();
重生出彈珠

>-需要注意的點-<
當Invoke時若有無法被調用的Function(如腳本被Destory)，會出現Error

>-運用上的細節-<
if(NotInputEvent != null) {  NotInputEvent.Invoke(); }
可以簡寫成
NotInputEvent?.Invoke();

>-----無輸入event-----<

痾...我的排版