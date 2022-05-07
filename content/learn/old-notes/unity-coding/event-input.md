---
title: "Input Event"
date: 2019-12-25
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

>-----有輸入event-----<

命名規則
通常事件的委派會宣告成以Handler結尾的變數
而事件會宣告成以Event結尾的變數(去掉委派的handler)
意思是建立出一種格式(Handler)，然後再建立基於格式的事件(event)

>-基本-<
建立正規的的有輸入event
public delegate void HaveInputHandler(string name);
public event HaveInputHandler haveInputEvent;

建立偷懶的有輸入event
public event Action<string> HaveInputEvent;

註冊事件
HaveInputEvent +=
FunctionA; (void FunctionA(string inputString) { print("A_ " + inputString); })

HaveInputEvent +=
FunctionB; (void FunctionB(string inputString) { print("B_ " + inputString); })

HaveInputEvent +=
FunctionC; (void FunctionC(string inputString) { print("C_ " + inputString); })

取消註冊
HaveInputEvent -= FunctionC;

觸發事件
NotInputEvent.Invoke("invoke");

當事件觸發時，被註冊進event的function都會受到調用，而function的參數(string inputString)都會輸入為Invoke時的參數("invoke")
當前情況為 Print出 A_invoke ,B_invoke
而FunctionC 因為被取消註冊所以沒受到調用

>-實際情況、運用-<
玩家更改名稱時，更新所有有顯示名稱的UI

建立event -
public event Action<string> UpdateNameUiEvent;
UpdateNameUiEvent += UpdateAvatarName
UpdateNameUiEvent += UpdateWeaponUserName
UpdateNameUiEvent += UpdateMainUiPlayerName

Function(不同腳本) -
更新頭像UI顯示名稱
void UpdateAvatarName(string name){ updateAvatarName...; }

更新武器UI顯示名稱
void UpdateWeaponUserName(string name){ updateWeaponUserName...; }

更新主UI顯示名稱   
void UpdateMainUiPlayerName(string name){ updateMainUiPlayerName...; }

情況 -
當玩家更改名稱的時候
UpdateNameUiEvent.Invoke("newPlayerName");

所有顯示名稱的UI都會被更新

>-需要注意的點-<


>-運用上的細節-<
可以直接在variable{get; set;}調用
同改名例:
string plaerName;
public string PlayerName
{ get => playername; set {playerName = value; UpdateNameUiEvent.Invoke(playerName); }}
>-----有輸入event-----<