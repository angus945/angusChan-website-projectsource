---
title: "Event Handler"
date: 2019-12-25
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

>-----有輸出委派-----<

委派通常就是只設定一個調用項目，事件就是不只一個

>-基本-<
建立Func<in T,out TResult>的有輸入、輸出委派
Func<string, int> inputOutputEvent; (命名錯誤，應該是 inputOutputHandler)

註冊事件
inputOutputEvent = FunctionA;
(void FunctionA(string inputString) { print(inputString); return 10; })

取消註冊
inputOutputEvent = null;

觸發事件
int out = inputOutputEvent.Invoke("inString");
print(out);

當事件觸發時，被註冊進event的function都會受到調用，而function的參數(string inputString)都會輸入為Invoke時的參數("invoke")，
而觸發的事件會回傳 Function 的回傳子(return 10)
當前情況為 Print出 inString ,10

>-實際情況、運用-<
以戰棋單位(unit)造成的傷害公式為例，單位A_1先對單位B_1發動攻擊，再對B_2發動攻擊，傷害基礎值為10(basisDamage = 10)

建立event -
Func<int, int> calculateDamageEvent;

Function(不同腳本) -
int UnitB1DamageFunction(int basisDamage)
{ int realDamage = basisDamage / 2; return realDamage; }

int UnitB2DamageFunction(int basisDamage)
{ int realDamage = basisDamage * 2; return realDamage; }


calculateDamageEvent = UnitB1DamageFunction;
int realDamage = calculateDamageEvent.Invoke(basisDamage);

calculateDamageEvent = UnitB2DamageFunction;
int realDamage = calculateDamageEvent.Invoke(basisDamage);

情況 -
當A_1對單位B_1發動攻擊時，回傳的實際傷害(realDamage)為 basisDamage(10) / 2 = 5
當A_1對單位B_2發動攻擊時，回傳的實際傷害(realDamage)為 basisDamage(10) * 2 = 20

>-需要注意的點-<
inputOutputEvent可以用 += 註冊(不過通常不會這麼做)，但Func收到的回傳只會是最後註冊的Function的回傳值

>-----有輸出委派-----<