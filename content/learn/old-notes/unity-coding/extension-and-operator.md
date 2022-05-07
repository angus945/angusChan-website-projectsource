---
title: "Extension and Operator"
date: 2021-02-13
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

C# 筆記
擴充方法Extension 和運算符多載operator

Extension
class 擴充功能寫法，可以自己寫一些想要的擴充功能
寫在static class 中，使用static 函數，調用著變量自身做為輸入
static class VariableExtension
{
    static Var function (this variable)
    {
        return variable...
    }
}

> integer 轉二進制
int i = 0b1101;
int a = i.GetBit(0); //1
int b = i.GetBit(1); //0
int c = i.GetBit(2); //1
int d = i.GetBit(3); //1
public static int GetBit(this int i, int bit)
{
    return i & (1 << bit);   
}
註: 最後會補充邏輯閘運算和指定二進制數值

> string 分割
string text = "extension example split with space"
string[] split = text.SplitWithSpace(); //extension, example, split, with, space
public static string[] SplitWithSpace(this string s)
{
    return s.Split(' ');
}

> enum 判斷
Animal animal = Animal.Cat;
animal.IsDot(); //false
public enum Animal
{
    Dog,
    Cat,
    Ant
}
public static bool IsDog(this Animal an)
{
    return an == Animal.Dog;
}

運算子多載 operator
在自訂一些數據類型的時候，可以用operator 讓他支援運算子的簡寫
Vector vectorA = vectorB + vectorC;
public static Vector operator +(Vector vector1, Vector vector2)
{
    return new Vector()
    {
        x = vector1.x + vector2.x,
        y = vector1.y + vector2.y,
    };
}

Vector vectorA = -vectorB
public static Vector operator -(Vector vector)
{
    return new Vector()
    {
        x = -vector.x,
        y = -vector.y,
    };
}
註: 沒辦法在extension 裡用operator，因為extension 只能寫在static class，但operator 不允許在static class 使用

額外補充先放這裡，之後可能會把這種換算獨立成一章筆記
額外補充 - integer 用不同進位方式指數值
int v = 0b10110 = 二進制的 10110 = 十進位的 21
int v = 0x1E240 = 十六進位的 1E240 = 十進位的 123456
基本上除了測試東西不太會用這種方式指定數值拉，只要知道有這東西就好

額外補充 - 位元移動
<< (左移) 把位元往左移
int a = 0b011;
a << 1 = 110

>> (右移) 把位元往右移
int a = 0b110;
a >> 1 = 011
註: 移超出進位範圍的位元會被吃掉

額外補充 - 邏輯閘，用於二進制的判斷
& (及閘 and) 如果兩個都是1，回傳1
110 & 111 = 110

| (或閘 or) 只要任意是1，回傳1
110 | 101 = 111

^ (遮罩 xor) 只要不相同，回傳1 (!= 的概念)
110 ^ 111 = 001

(反遮罩 nxor，但C# 沒有這個邏輯閘的樣子) 只要相同，回傳1 (== 的概念)
100 nxor 101 = 110