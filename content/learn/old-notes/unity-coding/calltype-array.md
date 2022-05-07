---
title: "Calltype Array"
date: 2020-02-23
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

這裡要注意的是，陣列或List傳入時，其實是傳入陣列指標的值
所以當你存取陣列的元素時，實際上是存取到同樣的值

    int[] a = new int[] { 2, 3 };

    PassArrayByValue(a);
    void PassArrayByValue(int[] a)   <= 傳入陣列指標的值
    {
        a[1] = 4;  <= 透過陣列位址去存取陣列的元素
    }

    Debug.Log(a[0] + "," + a[1]); 輸出: 2,4

因為即便傳入的是陣列的值，但是這個值其實是指向陣列位址的值 而不是整個陣列的值
所以當Function透過陣列位址去存取陣列的元素時還是會取得實際的變數

=======================================================

但當我的Function是要直接設定陣列的位址時 此時使用callByValue則不會將傳入的值修改

    int[] a = new int[] { 2, 3 };

    PassArrayByValue2(a);
    void PassArrayByValue2(int[] a)
    {
        a = new int[2] { 1, 2 };  <= 直接設定陣列的位址
    }

    Debug.Log(a[0] + "," + a[1]); 輸出: 2,3  <= 不會將傳入的值修改(call by value

=======================================================

相反的 如果傳入的方式改用callByReference，就有可能被直接修改陣列的指向

    int[] a = new int[] { 2, 3 };

   PassArrayByRef(ref a);
   void PassArrayByRef(ref int[] a)
   {
        a = new int[2] { 1, 2 };<= 直接設定陣列的位址
   }

   Debug.Log(a[0] + "," + a[1]); 輸出: 1,2<= 直接修改陣列的指向(call by reference

=======================================================
List 同 array

    List<int> list = new List<int>() { 6, 7 };

    Debug.Log(list[0] + "," + list[1]); 輸出: 6,7

    PassList(list);
    void PassList(List<int> list)
    {
       list[1] = 9;
    }

    Debug.Log(list[0] + "," + list[1]); 輸出: 6,9
=======================================================
陣列的傳入有點複雜，那位親戚說不好這樣不好說明
之後有時間會再詳細跟我講一次

所以我之後會還再弄一次筆記...應該

//
會有這兩ㄍ筆記的原因是因為我之前問了一個問題

這兩種更改List的寫法有什麼差別嗎?
第二種寫法會比第一種好嗎?

List <int> listA;

SortIntegerList(listA);
void SortIntegerList(List <int> setList)
{
      需要setList的計算...
      setList = 計算結果 (List.Add()
}
//
List <int> listA;

listA = SortIntegerList(listA);
List <int>  SortIntegerList(List <int> setList)
{
      需要setList的計算...
      return 計算結果  (List.Add()
}

他回答了之後，說我可以去稍微看一下傳值呼叫和傳參考呼叫的差別
於是就有這兩篇筆記ㄌ


