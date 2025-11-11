# 刷题笔记

## 1.二分查找

给定一个  `n`  个元素有序的（升序）整型数组  `nums`  和一个目标值  `target`  ，写一个函数搜索  `nums`  中的  `target`，如果目标值存在返回下标，否则返回  `-1`。

1. 你可以假设  `nums`  中的所有元素是不重复的。
2. `n`  将在  `[1, 10000]`之间。
3. `nums`  的每个元素都将在  `[-9999, 9999]`之间。

**思路**

采用二分查找，选择中间值 middle 比较，若 target > middle,则说明 target 在右侧重新选取 middle,

再次比较。若 target 在 nums 中不存在， 即比较到只有最后一个元素时不一致，则 target 不存在，返回-1

采用 while middle ≠ target 循环，在添加一个判定是否只有一个元素的情况。

```cpp
 int left = 0;
    int right = nums.size()-1;
    int middle = (left + right)/2;
    while (nums[middle] != target)
    {
        if (right-left <= 1) //需逐一比较
        {
            if (nums[left] == target) return left;
            if (nums[right] == target) return right;
            return -1;
        }
        if (nums[middle] > target) //说明target在左侧
        {
            right = middle;//修改右侧边界
            middle = (right + left)/2;//修改中间值
        }
        if (nums[middle] < target)
        {
            left = middle;//修改左侧边界
            middle =(right + left)/2;
        }
    }
    return middle;
```

- 这里要特别考虑当 left-right=1 即只有两个数字的情况，只能逐一比较，用 middle 判断不出来并不说明数值查找不到。

## 2.移除元素

给你一个数组  `nums` **和一个值  `val`，你需要  [**原地**](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)  移除所有数值等于  `val` **的元素。元素的顺序可能发生改变。然后返回  `nums`  中与  `val`  不同的元素的数量。

假设  `nums`  中不等于  `val`  的元素数量为  `k`，要通过此题，您需要执行以下操作：

- 更改  `nums`  数组，使  `nums`  的前  `k`  个元素包含不等于  `val`  的元素。`nums`  的其余元素和  `nums`  的大小并不重要。
- 返回  `k`。

**用户评测：**

评测机将使用以下代码测试您的解决方案：

```
int[] nums = [...]; // 输入数组
int val = ...; // 要移除的值
int[] expectedNums = [...]; // 长度正确的预期答案。
                            // 它以不等于 val 的值排序。

int k = removeElement(nums, val); // 调用你的实现

assert k == expectedNums.length;
sort(nums, 0, k); // 排序 nums 的前 k 个元素
for (int i = 0; i < actualLength; i++) {
    assert nums[i] == expectedNums[i];
}
```

如果所有的断言都通过，你的解决方案将会通**过**。

**思路**

数据类型：数组 or vector（题目要求似乎是数组）（但是 vector 是真简单啊）

从头遍历数组元素，如果遇到 val 值就将数组中的每个元素向前移动一位。

可行但是感觉不是最优的解法。

优化：

方法一：先遍历一遍数组，找到所有 val 值元素，记录对应的位置以及顺序，在根据这个来移动元素

方法二：创建另一个数组，若不是 val 值则写入，若是则跳过。很巧妙的方法（很像双指针法）

## 3.螺旋矩阵

给你一个正整数  `n` ，生成一个包含  `1`  到  `n2`  所有元素，且元素按顺时针顺序螺旋排列的  `n x n`  正方形矩阵  `matrix` 。

\*思路**\*:**

根据 n，循环 n 次，每次走一行一列，

# 4. [**216. 组合总和 III**](https://leetcode.cn/problems/combination-sum-iii/)

中等

相关标签

相关企业

找出所有相加之和为  `n` **的  `k` \*\***个数的组合，且满足下列条件：

- 只使用数字 1 到 9
- 每个数字  **最多使用一次**

返回  *所有可能的有效组合的列表* 。该列表不能包含相同的组合两次，组合可以以任何顺序返回。

**示例 1:**

```
输入:k = 3,n = 7
输出: [[1,2,4]]
解释:
1 + 2 + 4 = 7
没有其他符合的组合了。
```

**示例 2:**

```
输入:k = 3,n = 9
输出: [[1,2,6], [1,3,5], [2,3,4]]
解释:
1 + 2 + 6 = 9
1 + 3 + 5 = 9
2 + 3 + 4 = 9
没有其他符合的组合了。
```

**示例 3:**

```
输入: k = 4, n = 1
输出: []
解释: 不存在有效的组合。
在[1,9]范围内使用4个不同的数字，我们可以得到的最小和是1+2+3+4 = 10，因为10 > 1，没有有效的组合。

```

---

**思路**: 难度在于 k 会变,即数的个数不确定. 采用回溯法. 回溯函数参数为目标数, 数的个数, 下限(包含).

回溯主体为: 依次取 下限 — 9-当前剩余数的个数, 调用回溯函数, 目标数减去所取的数,代表选择所取的数, 数的个数 - 1, 下限为所取的数 + 1.

回溯出口为: 数的个数为 1 时, 目标数小于上线且大于下限, 即成功找到,加入到答案数组.若不是,则回溯.

# 5.**40.** [组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)

**思路** ：这道题难度在于由于可能会有多个相同的元素导致组合的去重问题难以解决。

我的解决办法：元素重复导致的组合重复是发生在递归树的同一层上，也就是回溯到上一层后组合尝试的新元素与之前的元素重复。可以设置一个数组来检测元素是否已在这一层使用过。尝试新元素时先检验。也可以将数组排序，则重复元素都在相邻位置上，只需记录本层上一个元素，与当前加入元素比较，若相等则说明重复，不用尝试元素。

```cpp
class Solution {
public:
    std::vector<std::vector<int>> combinationSum(std::vector<int>& candidates, int target) {
        std::sort(candidates.begin(), candidates.end());
        std::vector<int> path;
        std::vector<std::vector<int>> result;
        Helper(candidates, target, path, result, 0);
        return result;
    }

    void Helper(std::vector<int>& candidates, int diff, std::vector<int>& path, std::vector<std::vector<int>>& result, int index) {
        //回溯出口
        if (diff == 0) {
            result.push_back(path);
            return;
        }
        if (diff < 0) {
            return;
        }
        int prev = -1;
        for (int i = index; i < candidates.size(); i++) {
            if (diff - candidates[i] >= 0 && prev != candidates[i]) {
                path.push_back(candidates[i]);
                Helper(candidates, diff - candidates[i], path, result, i + 1);
                path.pop_back();
                prev = candidates[i];
            }
        }
    }
};
```

# 6. [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)

Problem: 131. 分割回文串

思路

这题的难点在于分割子串的方式，怎么做到不重复且不遗漏。

我的方法采用递进分割，将子串分割成一个前缀，一个后缀。并每次循环前缀加一个字符，后缀建一个字符。

为了不重复，我将后缀看成可分割的，前缀不可分割。所以问题就变成了找到回文的前缀，并找到后缀的所有回文子串（递归）。结果需将前缀加入到后缀的回文子串的前面。遍历所有可能前缀与后缀，就找到了该字符串的所有回文子串。

解题过程

这些方法具体怎么运用？

复杂度

时间复杂度: O(2^n)

```cpp
class Solution {
private:
    bool isPalindrome(std::string str) {
        int front, tail;
        front = 0;
        tail = str.size() - 1;
        while (front < tail) {
            if (str[front] != str[tail]) {
                return false;
            }
            front ++;
            tail --;
        }
        return true;
    }
    std::string slice(const std::string& str, int start, int end) {
        int length = end - start;
        return str.substr(start, length);
    }
public:
    std::vector<std::vector<std::string>> partition(std::string str) {
        std::vector<std::vector<std::string>> result;
        if (str.size() == 1) {
            result.push_back(std::vector<std::string>{str});
            return result;
        }
        if (isPalindrome(str)) {
            result.push_back(std::vector<std::string>{str});
        }
        for (int i = 0; i < str.size() - 1; i++) {
            std::string front = slice(str, 0, i + 1);
            std::string tail = slice(str, i + 1, str.size());
            if (!isPalindrome(front)) continue;
            std::vector<std::vector<std::string>> substrings = partition(tail);
            for (auto i : substrings) {
                i.insert(i.begin(), front);
                result.push_back(i);
            }
        }
        return result;
    }

};
```

# **7. [135. 分发糖果](https://leetcode.cn/problems/candy/)**

已解答

困难

`n`  个孩子站成一排。给你一个整数数组  `ratings`  表示每个孩子的评分。

你需要按照以下要求，给这些孩子分发糖果：

- 每个孩子至少分配到  `1`  个糖果。
- 相邻两个孩子评分更高的孩子会获得更多的糖果。

请你给每个孩子分发糖果，计算并返回需要准备的  **最少糖果数目** 。

思路一：一开始只有 rating 最小的孩子的糖果数是可以确定的，即为 1.根据这个思想，以这个 rating 最小的孩子为界，将数列分成两半。左右数列的糖果数量互不影响，故可以单独处理。先处理左数列的孩子，在左数列中 rating 最小的孩子的糖果树可以先确定。他的糖果数量取决于左右孩子的 ratings 和糖果数量（前提是该孩子糖果数量已经确定）。找到这个孩子，在判断相邻孩子是否已经确定糖果数量，若确定则比较 rating 大小，若大于，则糖果数量必须大于相邻的糖果数量。根据左右因素，最终确定该孩子的糖果数量。确定之后，再将做数列分为左右子数列，递归处理。递归出口为数列长度为 0.

算法主要操作是寻找子数列中的最小 ratings 的孩子。最多 n 次操作。每次操作不大于 n 次比较，时间复杂度 O(N^2).空间 O(N)。

应为寻找一个数列中子数列最小的元素存在多次重复比较,可以用一个二维数组来保存从 i-j 中的最小元素的下标。创建二维数组并赋值的时间复杂度为 O（N^2）,查询时间 O（1）。对于查询次数小于 n 次的效果不大。

```cpp
class Solution {
public:
/*
    std::vector<std::vector<int>> minMatrix;
    void createMinMatrix(std::vector<int>& ratings) {
        int size = ratings.size();
        minMatrix.resize(size, std::vector<int>(size, 0));
        for (int i = 0; i < size; i++) {
            minMatrix[i][i] = i;
        }
        for (int i = 0; i < size; i++) {
            for (int j = i + 1; j < size; j++) {
                minMatrix[i][j] = ratings[minMatrix[i][j - 1]] <= ratings[j] ? minMatrix[i][j - 1] : j;
                }
        }

*/
    }
    int candy(std::vector<int>& ratings) {
        std::vector<int> candy(ratings.size(), 0);
        //createMinMatrix(ratings);
        allocCandy(ratings, candy, 0, ratings.size() - 1);
        int sum = 0;
        for (const auto& i : candy) {
            sum += i;
        }
        return sum;
    }
    int findMin(std::vector<int>& ratings, int start, int end) {
        int minIndex = start;
        for (int i = start + 1; i <= end; i++) {
            minIndex = ratings[minIndex] > ratings[i] ? i : minIndex;
        }
        return minIndex;
    }
    void allocCandy(std::vector<int>& ratings, std::vector<int>& candy, int start, int end) {
        if (start > end) {
            return;
        }
        int minIndex = findMin(ratings, start, end);
        int min = ratings[minIndex];
        int leftLimit = 0;
        int rightLimit = 0;
        if (minIndex > 0 && min > ratings[minIndex - 1] && candy[minIndex - 1] != 0) {
            leftLimit = candy[minIndex - 1];
        }
        if (minIndex < ratings.size() - 1  && min > ratings[minIndex + 1] && candy[minIndex + 1] != 0) {
            rightLimit = candy[minIndex + 1];
        }
        int limit = std::max(leftLimit, rightLimit);
        candy[minIndex] = limit + 1;
        allocCandy(ratings, candy, start, minIndex - 1);
        allocCandy(ratings, candy, minIndex + 1, end);
    }
};
```

**思路二**：规则：相邻两个孩子评分更高的孩子会获得更多的糖果 可以分解为两个独立的规则：1. 评分比左孩子高的孩子的糖果数大于左孩子。2. 评分比右孩子高的孩子的糖果数大于右孩子。

我们可以先求出满足 1 的糖果数，在求出满足 2 的糖果数，在合并二者取其大，则同时满足了两个规则。

一。求出满足 1 的糖果数：从左向右，在满足 1 的条件下选择最小的糖果数。

二. 求出满足 2 的糖果数:从右向左,同理.

遍历数列的方向为什么从左向右或者反之,取决于在规则下糖果数依赖于左边的或则是右边的.

```cpp
int candy(std::vector<int>& ratings) {
        //先求左规则糖果数,从左往右
        int size = ratings.size();
        std::vector<int> leftCandy(size, 1);
        for(int i = 1; i < size; i++) {
            if (ratings[i] > ratings[i - 1]) {
                leftCandy[i] = leftCandy[i - 1] + 1;
            }
        }

        //再求右规则
        std::vector<int> rightCandy(size, 1);
        for (int i = size - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                rightCandy[i] = rightCandy[i + 1] + 1;
            }
        }

        //合并，取其大
        int sum =0;
        for (int i = 0; i < size; i++) {
            sum  += std::max(leftCandy[i], rightCandy[i]);
        }
        return sum;
    }
```

# **8. [406. 根据身高重建队列](https://leetcode.cn/problems/queue-reconstruction-by-height/)**

中等

相关标签

相关企业

提示

假设有打乱顺序的一群人站成一个队列，数组  `people`  表示队列中一些人的属性（不一定按顺序）。每个  `people[i] = [hi, ki]`  表示第  `i`  个人的身高为  `hi` ，前面  **正好**  有  `ki`  个身高大于或等于  `hi`  的人。

请你重新构造并返回输入数组  `people`  所表示的队列。返回的队列应该格式化为数组  `queue` ，其中  `queue[j] = [hj, kj]`  是队列中第  `j`  个人的属性（`queue[0]`  是排在队列前面的人）。

**示例 1：**

```
输入：people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
输出：[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
解释：
编号为 0 的人身高为 5 ，没有身高更高或者相同的人排在他前面。
编号为 1 的人身高为 7 ，没有身高更高或者相同的人排在他前面。
编号为 2 的人身高为 5 ，有 2 个身高更高或者相同的人排在他前面，即编号为 0 和 1 的人。
编号为 3 的人身高为 6 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
编号为 4 的人身高为 4 ，有 4 个身高更高或者相同的人排在他前面，即编号为 0、1、2、3 的人。
编号为 5 的人身高为 7 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
因此 [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] 是重新构造后的队列。
```

思路：可以发现身高最低的人的位置可以直接确定，就是为 k 的值。利用这一性质，每次确定一批身高最低的人，将其所在的位置删去，应为比他高的人的位置与他的位置在哪无关。由此一一确定每个升高的人的位置。时间复杂度:O(n^2 + n \* log n)

```cpp
class Solution {
public:
    static bool compare(const std::vector<int>& a,const std::vector<int>& b) {
        if (a[0] == b[0]) return a[1] < b[1];
        return a[0] < b[0];
    }
    std::vector<std::vector<int>> reconstructQueue(std::vector<std::vector<int>>& people) {
        std::sort(people.begin(), people.end(), compare);
        std::list<int> indexes;
        std::vector<std::vector<int>> result(people.size());
        for (int i = 0; i < people.size(); i++) {
            indexes.push_back(i);
        }
        int last, lastCount;
        last = -1;
        lastCount = 1;
        for (std::vector<int> i : people) {
            int position = 0;
            if (i[0] == last) {
                position = i[1] - lastCount;
                lastCount += 1;
            } else {
                lastCount = 1;
                position = i[1];
                last = i[0];
            }
            auto it = std::next(indexes.begin(), position);

            result.at(*it) = i;
            indexes.erase(it);
        }
        return result;
    }
};
```

算法主要操作：排序身高。以及删去已经确定的身高的位置。再根据 k 值确定位置。

思路二：按照升高顺序降序的往结果序列里插入元素，插入位置即为 ki 的值。

# **9. [452. 用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)**

已解答

中等

相关标签

相关企业

有一些球形气球贴在一堵用 XY 平面表示的墙面上。墙面上的气球记录在整数数组  `points` ，其中`points[i] = [xstart, xend]`  表示水平直径在  `xstart`  和  `xend`之间的气球。你不知道气球的确切 y 坐标。

一支弓箭可以沿着 x 轴从不同点  **完全垂直**  地射出。在坐标  `x`  处射出一支箭，若有一个气球的直径的开始和结束坐标为  `xstart`，`xend`，  且满足  `xstart ≤ x ≤ xend`，则该气球会被  **引爆** 。可以射出的弓箭的数量  **没有限制** 。 弓箭一旦被射出之后，可以无限地前进。

给你一个数组  `points` ，*返回引爆所有气球所必须射出的  **最小**  弓箭数* 。

```cpp
class Solution {
public:
    static bool compare(const std::vector<int>& a, const std::vector<int>& b) {
        if (a[1] == b[1]) {
            return a[0] < b[0];
        }
        return a[1] < b[1];
    }
    int findMinArrowShots(std::vector<std::vector<int>>& points) {
        std::vector<std::vector<int>> positions;
        int id = 0;
        for (const auto& i : points) {
            positions.push_back({0, i[0],id});
            positions.push_back({1, i[1], id});
            id += 1;
        }
        std::vector<bool> isStart(points.size(), false); // to save whether is started
        std::sort(positions.begin(), positions.end(), compare);
        int arrowCount = 0;
        bool foundStart = false;
        int index = 0;
        for (const auto& i : positions) {
            if (i[0] == 0) {
                if (!foundStart) {
                    arrowCount += 1;
                    foundStart = true;
                }
                isStart[i[2]] = true;
            } else {
                if (foundStart && isStart[i[2]]) {
                    foundStart = false;
                    std::fill(isStart.begin(), isStart.end(), false);
                }
            }
        }
        return arrowCount;

    }
};
```

# **10. [435. 无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/)**

给定一个区间的集合  `intervals` ，其中  `intervals[i] = [starti, endi]` 。返回  *需要移除区间的最小数量，使剩余区间互不重叠* 。

**注意**  只在一点上接触的区间是  **不重叠的**。例如  `[1, 2]`  和  `[2, 3]`  是不重叠的

思路一：要达到没有重叠区间的情况，需要将所有重叠的区间去除至少一个区间。为了达到去除区间数最小，在重叠的两个区间中选择 end 较大的，应为如果 end 小的与另一个区间重叠，其必定与较大的也重叠。但是若 end 较大的与另一个重叠，较小的不一定会与他重叠。再加上前提条件两个重叠的区间必定有一个会被删去，我们做最优解，删去 end 最大的。我们现在要找到所有重叠区间，并减去 end 较大的一个。将所有区间按照 start 大小升序排序。若 start【i] < end[i - 1]则为重叠区间,将 end 较大的删去,即 end[i] = min(end[ i - 1], end[i]),再比较下一个区间.

```cpp
static bool compareInterval(const std::vector<int>& a, const std::vector<int>& b) {

        return a[0] < b[0];
    }
    int eraseOverlapIntervals(std::vector<std::vector<int>>& intervals) {
        int removeCount = 0;
        std::sort(intervals.begin(),intervals.end(), compareInterval);
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] < intervals[i - 1][1]) {
                removeCount += 1;
                intervals[i][1] = min(intervals[i][1], intervals[i - 1][1]);
            }
        }
        return removeCount;
    }
```

思路二：可将这题看成找重叠区间集合（即多个集合互相重叠）的个数，需要减去的区间数等于总数减去重叠区间集合的个数。解法与 9. [\*\*452. 用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)相似。\*\*

# 11. median of two sorted arrays

Finding the median of a sorted array is easy: return the middle element. But what if you are given two sorted arrays A and B, of size m and n respectively, and you want to find the median of all the numbers in A and B. You may assume that A and B are disjoint.

(1) when m = n :

compare median of A m1 with median of B m2. if m1 > m2, remove second half of A and first half of B. Then we get two subarray of size n/2. repeat until size small than a constant. O(lg n)

(2)Without loss of generality, assume |A| = m > n = |B|. We can safely
remove elements A[0 : m−n/2] and A[m+n/2 : m − 1] because none of these elements can
be the median of A + B. After this process, we get two arrays of size approximately
n. Then we can run part (b). The complexity is Θ(lg(min(m, n)))

# 160 相交链表

给定 2 个单链表 head, 找到单链表相交的起点. 若没有则返回无.
没有环结构.
思路: 1. 判断是否相交: 判断尾节点是否相同. 2. 判断相交节点位置:
暴力搜索, 假设一个节点是, 依次遍历拎一个链表.
计算出 A, B 长度插值, 再让其中一个领先相应的差值, 同时向后, 遇到第一个相同的即为相交节点.

```cpp
/**

 * Definition for singly-linked list.

 * struct ListNode {

 *     int val;

 *     ListNode *next;

 *     ListNode(int x) : val(x), next(NULL) {}

 * };

 */

class Solution {

public:

    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {

        int Alength  = 0;

        int Blength = 0;

        ListNode* Acurr = headA;

        while(Acurr != NULL) {

            Alength += 1;

            Acurr = Acurr->next;

        }

        ListNode* Bcurr = headB;

        while(Bcurr != NULL) {

            Blength += 1;

            Bcurr = Bcurr->next;

        }

        if (Acurr != Bcurr) return NULL;

        int diff = Alength - Blength;

        Acurr = headA;

        Bcurr = headB;

        if (diff > 0) {

            while(diff > 0) {

                diff -= 1;

                Acurr = Acurr->next;

            }

        } else {

            while(diff < 0) {

                diff += 1;

                Bcurr = Bcurr->next;

            }

        }

        while (Acurr != NULL) {

            if (Acurr == Bcurr) return Acurr;

            Acurr = Acurr->next;

            Bcurr = Bcurr->next;

        }

        return NULL;

    }

};

```

时间复杂度 O(m + n), 空间 O(1).
总结:模拟的思维. 将一个一个节点看作距离, 将两个链表的相交看作俩路的相交.通过计算 A, B 两条"路"的长度差, 来让两条路上的"行者"同步. 什么时候同时到达同一条路上即对应的相加节点.
在题解上看到了个很有意思解法: 遍历 A 将 A 的值赋值成相反数, 遍历 B 时遇到负数说明到达相交节点. (题目限制 val 非负数).最后再把 A 值改回来.本质上时求连哥哥链表的共同元素, 通过操作将 A 表中的节点带有独特的标识,使得 B 表能一下就是识别出来是 A 表的元素. 如果 val 为任何实数呢?

# [236 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。
**思路**: 深度优先搜索, 左序遍历,直到找到两个值中的其中一个, 用一个 stack 来记录其祖宗节点. 找到之后, 这个 stack 应包含当前节点以及所有祖宗.依次出栈, 因为是左序遍历, 因此不用检查左子树,只需遍历其右子树.且若子节点一再 stack 中,则无需检查. 这样子每个节点最多遍历依一次. 时间复杂度 O(n).

```cpp
class Solution {

public:

   TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {

        if (!root) return nullptr;

        // 第一阶段：DFS左序遍历找到第一个目标节点，记录祖先路径

        vector<TreeNode*> path_to_first;

        TreeNode* first_target = nullptr;

        int target_val1 = p->val, target_val2 = q->val;

        if (findPathDFS(root, target_val1, target_val2, path_to_first, first_target)) {

            int second_target_val = (first_target->val == target_val1) ? target_val2 : target_val1;

            // 检查第一个目标节点的子树中是否包含第二个目标

            if (findTargetInSubtree(first_target, second_target_val)) {

                return first_target;

            }

            // 从路径向上查找，检查每个祖先节点

            for (int i = path_to_first.size() - 2; i >= 0; i--) {

                TreeNode* ancestor = path_to_first[i];

                // 如果祖先节点本身就是第二个目标

                if (ancestor->val == second_target_val) {

                    return ancestor;

                }

                // 确定需要搜索的子树（避免重复搜索已遍历的路径）

                TreeNode* subtree_to_search = nullptr;

                if (i < (int)path_to_first.size() - 1) {

                    TreeNode* child_in_path = path_to_first[i + 1];

                    if (ancestor->right != child_in_path) {

                        // 第一个目标在左子树，搜索右子树

                        subtree_to_search = ancestor->right;

                    }

                }

                if (subtree_to_search && findTargetInSubtree(subtree_to_search, second_target_val)) {

                    return ancestor;

                }

            }

        }

        return nullptr;

   }

private:

   // DFS查找第一个目标节点并记录路径

   bool findPathDFS(TreeNode* node, int target1, int target2,

                    vector<TreeNode*>& path, TreeNode*& first_target) {

        if (!node) return false;

        path.push_back(node);

        // 找到目标节点

        if (node->val == target1 || node->val == target2) {

            first_target = node;

            return true;

        }

        // 左序遍历：先搜索左子树

        if (findPathDFS(node->left, target1, target2, path, first_target)) {

            return true;

        }

        // 再搜索右子树

        if (findPathDFS(node->right, target1, target2, path, first_target)) {

            return true;

        }

        // 回溯：当前路径不包含目标节点

        path.pop_back();

        return false;

   }

   // 在子树中查找目标值

   bool findTargetInSubtree(TreeNode* root, int target_val) {

        if (!root) return false;

        if (root->val == target_val) return true;

        return findTargetInSubtree(root->left, target_val) ||

               findTargetInSubtree(root->right, target_val);

   }

public:

};

```

本题思路不难想, 但是实现比较繁琐.

# [234: 回文链表](https://leetcode.cn/problems/palindrome-linked-list/)

给你一个单链表的头节点  `head` ，请你判断该链表是否为回文链表。如果是，返回  `true` ；否则，返回  `false` 1.把链表转换为字符串, 即可从中间开始向两边比较. 时间 O(n), 空间 O(n)
怎么把空间减少到 O(1)?
存储数据来比较肯定是不行了, 看看能不能用两个指针.但是是单向链表, 两个指针只能同向.
翻转半边的链表, 这样两个指针方向相反, 依次比较.
搞两个指针,分别指向中间的节点, 若为奇数, 各向外移动一个节点.在将左边指针所在的链表翻转.再移动指针比较节点.
翻转链表, 用两个指针可以不用别的空间.

```cpp
class Solution {

public:

    bool isPalindrome(ListNode* head) {

        //get list length

        int length = 0;

        ListNode* it = head;

        while(it != nullptr) {

            length += 1;

            it = it->next;

        }

        //get two pointers to middle node

        //if length is odd

        ListNode* left = head;

        ListNode* right;

        int step = length / 2 - 1;

        while(step > 0) {

            step -= 1;

            left = left->next;

        }

        if (length % 2 != 0) {

            //check if length == 1

            if (left->next == nullptr) {

                return true;

            }

            right = left->next->next;

        } else {

            right = left->next;

        }

        left->next = nullptr;

        reverse(head);

        while (left != nullptr) {

            if (left->val != right->val) {

                return false;

            }

            left = left->next;

            right = right->next;

        }

        return true;

    }

    ListNode* reverse(ListNode* head) {

        ListNode* prev = nullptr;

        ListNode* curr = head;

        while (curr != nullptr) {

            ListNode *next = curr->next;

            curr->next = prev;

            prev = curr;

            curr = next;

        }

        return prev;

    }

};

```

# [729.每日温度](https://leetcode.cn/problems/daily-temperatures/)

给定一个整数数组  `temperatures` ，表示每天的温度，返回一个数组  `answer` ，其中  `answer[i]`  是指对于第  `i`  天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用  `0`  来代替。 1.暴力遍历. 对于第 i 天往后寻找首个大与它的点, 得到长度.
时间 O(n^2).空间 O(1). 2.怎么优化?
从后面开始, 将节点最近的大与他的节点位置记录. 最后一个是 0. 检查新节点时,先检查最近的节点,是否小于它,若小于,则得到最近大节点.若大于,根据这个节点的最近大节点位置再于其比较.重复上述过程,直到得到大与它的节点或者得到 0.
时间复杂度:O(n).空间 O(n).

```cpp
# include<vector>

using namespace std;

class Solution {

    public:

        vector<int> dailyTemperatures(vector<int>& temperatures) {

            vector<int> nearestLargerNodeIndex(temperatures.size(), -1);

            int curr = temperatures.size() - 2;

            nearestLargerNodeIndex[curr + 1] = 0;

            for(;curr >= 0; curr--) {

                int next = curr + 1;

                bool noLargerNode = false;

                while(temperatures[curr] >= temperatures[next]) {

                    if (nearestLargerNodeIndex[next] == 0) {

                        noLargerNode = true;

                        break;

                    }

                    next = nearestLargerNodeIndex[next] + next;

                }

                if (noLargerNode) {

                    nearestLargerNodeIndex[curr] = 0;

                } else {

                    nearestLargerNodeIndex[curr] = next - curr;

                }

            }

            return nearestLargerNodeIndex;

        }

    };

```

时间复杂度分析:
采用均摊分析法.算法有两层循环, 一层 for 循环 n-1 次. 内部 while 循环不知道次数. 但是可以通过 next 的访问次数计算.每个 nearestLargerNode 元素至多访问 1 次. 应为若该元素被访问则说明前面有元素的值比他大.在下一次查找时将不会在访问,直接被跳过.

# [226 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

递归结构.O(n)

```cpp
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (root == nullptr) {
            return nullptr;
        }
        TreeNode* temp = root->left;
        root->left = root->right;
        root->right = temp;
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};
```

# [221. 最大正方形](https://leetcode.cn/problems/maximal-square/)

中等
在一个由  `'0'`  和  `'1'`  组成的二维矩阵内，找到只包含  `'1'`  的最大正方形，并返回其面积。
**简单解法**: 从矩阵左上角开始, 依次遍历元素. 记录当前最大全为 1 正方形的边长. 对于当前遍历的元素, 按着左下顺序遍历比最大正方形边长大一个的正方形里的元素. 检查是否全为 1. 若是,则更新最大正方形的边长.在从这个元素遍历(考虑到这个点开始可能比更新后的正方形还大). 对于不可能比当前最大的边长还大的元素直接跳过.(例如该元素在离矩阵右侧差 n 个元素, 但是当前最大边长为 n. 因此不可能大于.)
**改进解法**: 简单解法的问题主要在于多个元素会多次遍历用于判断在正方形是否全是 1. 改进的点在于让那些遍历过的变量除了用于判断是否全为 1,并且当它为 0 的时候, 可以直接否定其左上方的元素半径为要找的正方形边长, 全部无效.一个元素被设为无效, 在外循环判断其右下方的元素是否都为 1 的时候可以直接跳过.
**实现**:
主循环从左上方开始, 按行遍历元素. 选择其为正方形的左上角起点.正方形的边长是当前最大边长+1. 子循环是检查正方形内的元素是否全为 1.
若是, 更新最大边长. 再往外扩一圈,检查是不是全为 1.
若不是, 则在遇到的 0 位置其左上方半径为 len 的所有元素标记为无效.
循环,直到到达不可能的元素.

实现比较复杂, 且没通过测试.

用动态规划来解决问题:

发现可以将最大正方形分解成四个边长-1 的小正方形.

- **创建 `dp` 矩阵**：和原矩阵 `matrix` 一样大。
- **定义含义**：`dp[i][j]` = 以 `(i, j)` 为右下角的最大正方形**边长**。
- **初始化**：
  - `dp[0][j]` = `matrix[0][j]`
  - `dp[i][0]` = `matrix[i][0]`
- **递推**（遍历 `i` 从 1 到 `m-1`，`j` 从 1 到 `n-1`）：
  - 如果 `matrix[i][j] == '0'`，则 `dp[i][j] = 0`。
  - 如果 `matrix[i][j] == '1'`，则 `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`。
- **找答案**：

  - 在填充 `dp` 矩阵的**同时**，用一个变量 `max_side` 记录下出现过的最大 `dp` 值。
  - 最终返回 `max_side * max_side`。

  ```cpp
  #include <vector>
  #include <algorithm>
  #include <iostream>
  using namespace std;
  class Solution {
  public:
      int maximalSquare(vector<vector<char>>& matrix) {
          vector<vector<int>> dp(matrix.size(), vector<int>(matrix[0].size(), 0));
          int maxSize = 0;
          for (int i = 0; i < matrix.size(); i++) {
              if (matrix[i][0] == '1') {
                  maxSize = 1;
                  dp[i][0] = 1;
              }
          }
          for (int i = 0; i < matrix[0].size(); i++) {
              if (matrix[0][i] == '1') {
                  maxSize = 1;
                  dp[0][i] = 1;
              }
          }

          for (int i = 1; i < matrix.size(); i++) {
              for(int j = 1; j < matrix[0].size(); j++) {
                  if (matrix[i][j] == '1') {
                      dp[i][j] = min(dp[i - 1][j - 1], min(dp[i - 1][j], dp[i][j - 1])) + 1;
                      maxSize = max(maxSize, dp[i][j]);
                  }
              }
          }
          return maxSize * maxSize;
      }
  };

  ```

# [**215. 数组中的第 K 个最大元素**](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

中等

给定整数数组  `nums`  和整数  `k`，请返回数组中第  **`k`**  个最大的元素。

请注意，你需要找的是数组排序后的第  `k`  个最大的元素，而不是第  `k`  个不同的元素。

你必须设计并实现时间复杂度为  `O(n)`  的算法解决此问题。

**想法**:让我想起了 select 算法.分治法.

**思路**: 选择一个数作为 pivot, 将原数组与 pivot 比较, 分为大与或等于它的和小于它的.二者长度分别为 x, y. 若 k-1 > x, 说明要找的元素在 y 中, 递归查找数组 y 的第 k-x 位元素. 若 k-1 < x, 说明在 x 中. 递归查找数组 x 中的第 k 位元素. 若 k - 1 = x, 说明 pivot 就是要找的元素,返回.

最坏情况是数组是顺序的.这时要比较 O(n^2)的时间复杂度.

改进方法:median of medians. 或者随机挑选 pivot. 使得期望复杂度为 O(n). 不受输入的影响.

还有一个问题是输入数组大量重复元素.解决方法: 将原来的数组分成大与, 等于, 小于三个数组. 若 k 落在等于数组,直接返回 pivot.

```cpp
# include <vector>
# include <random>
using namespace std;
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        //choose pivot randomly
        std::random_device rd;
        std::mt19937 gen(rd()); // Mersenne Twister 生成器
        std::uniform_int_distribution<> dis(0, nums.size() - 1); // 均匀分布
        int randomIndex = dis(gen); // 生成随机索引
        int pivot = nums[randomIndex];
        vector<int> largerNums;
        vector<int> equalNums;
        vector<int> smallerNums;
        // 遍历元素, 划分数组
        for(int i = 0; i < nums.size(); i++) {
            if (nums[i] > pivot) {
                largerNums.pushback(nums[i]);
            } else if (nums[i] == pivot) {
                equalNums.pushback(nums[i]);
            } else{
                smallerNums.pushback(nums[i]);
            }
        }
        //determine where Kth element is
        if (largerNums.size() >= k){
            return findKthLargest(largerNums, k);
        } else if (largerNums.size() + equalNums.size() >= k) {
            return pivot;
        } else {
            return findKthLargest(smallerNums, k - largerNums.size() - equalNums.size());
        }
    }
};
```

随机挑选 pivot + 分三个数组.

为什么不用 median of medians. 算法常数因子太大, 实际速度慢.常数因子就是算法实际复杂度中的系数.例如 一个算法复杂度 2 _ n, 另一个 10 _ n. 尽管这两个都是 O(n). 但是前者比后者快 5 倍. 这就是常数因子的影响.

# [**208. 实现 Trie (前缀树)**](https://leetcode.cn/problems/implement-trie-prefix-tree/)

[**Trie**](https://baike.baidu.com/item/%E5%AD%97%E5%85%B8%E6%A0%91/9825209?fr=aladdin)（发音类似 "try"）或者说  **前缀树**  是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

- `Trie()`  初始化前缀树对象。
- `void insert(String word)`  向前缀树中插入字符串  `word` 。
- `boolean search(String word)`  如果字符串  `word`  在前缀树中，返回  `true`（即，在检索之前已经插入）；否则，返回  `false` 。
- `boolean startsWith(String prefix)`  如果之前已经插入的字符串  `word`  的前缀之一为  `prefix` ，返回  `true` ；否则，返回  `false` 。
- `1 <= word.length, prefix.length <= 2000`
- `word`  和  `prefix`  仅由小写英文字母组成
- `insert`、`search`  和  `startsWith`  调用次数  **总计**  不超过  `3 * 104`  次

想法:61B 学过的数据结构.用一个 tree 来表示这种结构, node 代表一个字符, 其子节点代表后续的字符. 用一个 iskey 来确定是否是插入的 word.

因为 word 和 prefix 只由小写英文字母组成因此子节点数量最多 24(?还是 26)个.

Node 数据结构: value : char, 代表其中的一个字符. isKey 代表是不是插入的 word 的最后一个字符.

childs. vector<Node> 子节点, index 代表在字母表中的位置.

Trie() : 初始化一个初始节点, value 为空, 代表根节点.

insert(word): 依次将 word 中的字符一个一个添加到树中, 若前缀已存在则跳过. 在最末尾的元素 iskey 设为 true.

search: 依次查找字符, 并确定最后一个字符的 iskey 值

startswith: 类似 search,但不用确定 iskey

原先 insert 的实现出了问题,错误的在每个字符 node 判断了一次是否是末尾元素, 从而覆盖了原先的 iskey 的值,导致错误. 应该是循环结束后赋值 iskey 为 true 即可.

```
# include <iostream>
# include <string>
using namespace std;

class Node {
    public:
        char value;
        bool isKey;
        Node* childs[26];
        Node() {
            value = '\0';
            isKey = false;
            for (int i = 0; i < 26; i++) {
            childs[i] = nullptr;
            }
        }
};
class Trie {
public:
    Node* root;
    Trie() {
        root = new Node();

    }

    ~Trie() {
        // 需要释放内存
        deleteNode(root);
    }



    void insert(string word) {
        Node* curr = root;
        for(int i = 0; i < word.size(); i++) {
            if (curr->childs[word[i] - 'a'] == nullptr) {
                curr->childs[word[i] - 'a'] = new Node();
                curr = curr->childs[word[i] - 'a'];
                curr->value = i;
            } else {
                curr = curr->childs[word[i] - 'a'];
            }
        }
        curr->isKey = true;
    }

    bool search(string word) {
        Node* curr = root;
        for(int i = 0; i < word.size(); i++) {
            if (curr->childs[word[i] - 'a'] == nullptr) {
                return false;
            } else {
                curr = curr->childs[word[i] - 'a'];
            }
        }
        return curr->isKey;
    }

    bool startsWith(string prefix) {
        Node* curr = root;
        for(int i = 0; i < prefix.size(); i++) {
            if (curr->childs[prefix[i] - 'a'] == nullptr) {
                return false;
            } else {
                curr = curr->childs[prefix[i] - 'a'];
            }
        }
        return true;
    }
    private:
    void deleteNode(Node* node) {
        if (!node) return;
        for (Node* child : node->childs) {
            deleteNode(child);
        }
        delete node;
    }
};

/**
 * Your Trie object will be instantiated and called as such:
 * Trie* obj = new Trie();
 * obj->insert(word);
 * bool param_2 = obj->search(word);
 * bool param_3 = obj->startsWith(prefix);
 */

```

# [**207. 课程表**](https://leetcode.cn/problems/course-schedule/)

你这个学期必须选修  `numCourses`  门课程，记为  `0`  到  `numCourses - 1` 。

在选修某些课程之前需要一些先修课程。 先修课程按数组  `prerequisites`  给出，其中  `prerequisites[i] = [ai, bi]` ，表示如果要学习课程  `ai`  则  **必须**  先学习课程   `bi` 。

- 例如，先修课程对  `[0, 1]`  表示：想要学习课程  `0` ，你需要先完成课程  `1` 。

请你判断是否可能完成所有课程的学习？如果可以，返回  `true` ；否则，返回  `false` 。

想法: 拓扑排序.课程之间的先修关系可以看成有向图, 先修指向后修. 判断是否可能完成, 等同于判断有向图中存不存在环.

我的思路: 计算每个点的入度, 即指向这个点的边数量. 选择入度为 0 的点, 删去这个点以及其所有出的边

重复上述过程,直到没有点或者所有点的入度都大于 0.

问题在于怎么计算每个点的入度.

我的思路: 维护一个 hashmap, key 为点, value 是该点的入度. 输入边对时初始化 hashmap 中的键值对.并维护每个点的有向 neighbor. 遍历所有键值对,直到找到入度为 0 的点, 将这个点的 neighbor 的入度-1. 在重复上述过程.

改进:不需要每次都遍历所有键值对, 用一个队列, 每当有入度为 0 的点添加进去, 依次出列.

# [**11. 岛屿数量**](https://leetcode.cn/problems/number-of-islands/)

给你一个由  `'1'`（陆地）和  `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

想法: 让我想起了并查集.将那些相邻的 1 union, 最后查询有多少个集合即可.

用类似实现并查集的方法解决这个问题. 由左上至右下顺序遍历整个矩阵, 遇到’1’, 检查其左边或上方的元素是不是’1’, 若是, 说明是同一个岛屿, 跳过, 若不是, 说明是新岛屿, 岛屿数量加一.

漏洞: 若岛屿的左或上方没有 1,不代表他没有与别的 1 联通, 有可能与其右边但是上方的’1’间接联通.

因此还是需要类似并查集一样联通的操作.

左上至右下遍历所有元素, 计算 1 的数量 n. 初始化 uf 数量 n.将每个 1 按顺序编号.

在此遍历所有元素, 遇到 1, 将其与左边与上边的 1union.

遍历完成后, 直接返回连通分量的数量.

```python
class UnionFind:
    """
    一个高效的并查集实现，支持路径压缩和按大小合并。
    """
    def __init__(self, n: int):
        """
        初始化并查集。
        :param n: 元素的数量，编号从 0 到 n-1。
        """
        # parent[i] 存储元素 i 的父节点
        # 初始时，每个元素都是自己的父节点
        self.parent = list(range(n))
        # size[i] 存储以 i 为根的集合的大小（元素数量）
        # 初始时，每个集合大小都为 1
        self.size = [1] * n
        # 连通分量的数量
        self.count = n

    def find(self, i: int) -> int:
        """
        查找元素 i 的根节点（即它所属集合的代表）。
        同时执行“路径压缩”。
        """
        # 如果 i 不是根节点 (i 的父节点不是它自己)
        if self.parent[i] != i:
            # 递归地找到真正的根节点，
            # 并把 i 的父节点直接指向根节点（路径压缩）
            self.parent[i] = self.find(self.parent[i])

        # 返回根节点
        return self.parent[i]

    def union(self, i: int, j: int) -> bool:
        """
        合并元素 i 和元素 j 所在的两个集合。
        使用“按大小合并”优化。
        """
        # 1. 找到 i 和 j 各自的根节点
        root_i = self.find(i)
        root_j = self.find(j)

        # 2. 如果根节点相同，说明它们已经在同一个集合中，无需合并
        if root_i == root_j:
            return False

        # 3. 按大小合并：总是将小的集合合并到大的集合中
        if self.size[root_i] < self.size[root_j]:
            # root_i 集合更小，将其合并到 root_j
            self.parent[root_i] = root_j
            self.size[root_j] += self.size[root_i]
        else:
            # root_j 集合更小（或一样大），将其合并到 root_i
            self.parent[root_j] = root_i
            self.size[root_i] += self.size[root_j]

        # 4. 合并后，连通分量的总数减 1
        self.count -= 1
        return True

    def connected(self, i: int, j: int) -> bool:
        """
        检查两个元素 i 和 j 是否在同一个集合中。
        """
        return self.find(i) == self.find(j)

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        # 给'1'按顺序编号
        num1 = 0
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == '1':
                    grid[i][j] = num1
                    num1 += 1

        #初始化unionfind
        uf = UnionFind(num1)
        #遍历元素,将邻接的'1'连接起来('1'修改成了序号)
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] != '0':
                    if i > 0 and (grid[i -1][j] != '0'):
                        uf.union(grid[i][j], grid[i - 1][j])
                    if j > 0  and (grid[i][j - 1] != '0'):
                        uf.union(grid[i][j], grid[i][j - 1])

        return uf.count

```

另一种解法: DFS/BFS.

将相互连接的陆地看成相邻的节点, 依次遍历所有陆地, 找到陆地后再按 bfs / dfs 的顺序遍历其所有相邻陆地, 并将遍历过的陆地打上记号, 下次将不再遍历. 当遍历完成后, 说明已经将这个岛屿中的陆地遍历完了, 因此岛屿数加 1. 再依次遍历陆地.

# [**198. 打家劫舍**](https://leetcode.cn/problems/house-robber/)

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警**。

给定一个代表每个房屋存放金额的非负整数数组，计算你  **不触动警报装置的情况下** ，一夜之内能够偷窃到的最高金额。

**思路**: 这个题我把它看出状态转移加决策的模型. 状态式此时总现金和能不能偷下一家的(1 为能,0 反之). 所以计算过程是从一开始的 0,1(代表总现金 0, 能偷下一家). 这是涉及到两种 action, 偷 or 不偷, 衍生出两种状态, 假设该家现金为 a. (a, 0), (0,1). 此时比较这两个状态, 如果其中的状态现金比另一个多,而且能偷状态>=另一个.说明该状态支配另一个状态, 说明另一个状态最优也比不过这个.所以没有必要继续考虑拎一个状态,将其从队列中去除.在从剩下的状态里衍生.我发现这样子的操作下队列里最多只有两种状态(分别是 0,1) 这样子算法复杂度为 O(n).(因为每次状态衍生最多一个, 因此只需比较一次).

形式化的表述: 状态转移方程: dp[i]代表偷到第 i 家时的最大金额(为了简化表述, 这里数组下标从 1 开始)

偷到第 i 家时,有两种选择偷, 不偷. 偷的话需要第 i-1 家不偷. 因此这种情况的最大值时 dp[i-2] + val[i].

不偷的话: 最大值等于 dp[i-1]. 要得到这个值,二者取其大即可.

空间压缩: 可以看到计算 dp[i]实际只需两项 dp[i - 1], dp[i - 2]. 因此空间可以压缩到两个变量.

时间: O(n) 空间(O(1)).

```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        rob = 0   #代表偷了前一家的最大值
        notRob = 0  # 代表没偷前一家的最大值
        for num in nums:
		        #代表开始进行下一次偷窃
            temp = notRob + num
            notRob = max(notRob, rob)
            rob = temp
        return max(rob, notRob)
```

给定一个大小为  `n` **的数组  `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数  **大于\*\* `⌊ n/2 ⌋`  的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素.

思路: 第一个想法是用一个 map 保存数字的出现次数, 统计完后选择最大的就行.

时间 O(n), 空间 O(n).

改进: 如何把空间减少到 O(1).

现在的空间需要记录所有的元素的出现次数.所以是 O(n). 关键在于多数元素, 而不是最多的元素.

多数元素, 如果多数元素与其他少数元素抵消, 到最后数列只会留下多数元素.

将不同的元素相互抵消, 最后留下来的一个或多个相同的元素为多数元素.

**思路:** 需要找到不同的两个元素作为一对消除. 一左一右两个下标, 若右边下表元素与左边下表元素一样, 向右移动,直到找到不同的, 左指针有两种情况,一种是下一个元素与其上一个相同, 这种情况说明元素没有被消除,向右.左指针向右一个. 若不同说明已被消除, 则跳到做指针右侧, 做指针需要移动两个.若右指针超过数列, 说明以及消除玩所有元素, 此时做指针的元素为多数元素.

以上思路有纰漏.问题在于左指针移动时, 若遇到不同元素, 直接跳到右指针右侧是不对的. 可能会遗漏不同元素右侧的相同元素.

更为巧妙的解法: 用一个 candidate 代表候选的做多元素, count 代表该元素的个数. 遇到 candidate 里的元素, count + 1, 遇到非 candidate, count - 1. 若 count = 0, 改变 candidate 为当前遇到的元素, count = 1.

```python
class Solution:

    def majorityElement(self, nums: List[int]) -> int:
        candidate = nums[0]
        count = 1
        for i in range(1,len(nums)):
            if nums[i] == candidate:
                count += 1
            else:
                count -= 1
                if (count < 0):
                    candidate = nums[i]
                    count = 1

        return candidate


```

# [**238. 除自身以外数组的乘积**](https://leetcode.cn/problems/product-of-array-except-self/)

给你一个整数数组  `nums`，返回 数组  `answer` ，其中  `answer[i]`  等于  `nums`  中除  `nums[i]`  之外其余各元素的乘积  。

题目数据  **保证**  数组  `nums`之中任意元素的全部前缀元素和后缀的乘积都在   **32 位**  整数范围内。

请  **不要使用除法，**且在  `O(n)`  时间复杂度内完成此题。

用除法的解法

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int[] answer = new int[nums.length];
        long product = 1L;
        int zeroCount = 0;
        for (int num : nums) {
            if (num == 0) {
                zeroCount += 1;
            }
            product *= num;
        }

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 0) {
                if (zeroCount == 1) {
                    int nozeroProduct = 1;
                    for (int j = 0; j < nums.length; j++) {
                        if (j != i) {
                            nozeroProduct *= nums[j];
                        }
                    }
                    answer[i] = nozeroProduct;
                    continue;
                }
                answer[i] = (int)product;
                continue;
            }
            answer[i] = (int)product / nums[i];
        }
        return answer ;
    }
}
```

正经的思路: 肯定是想着利用先前的结果推导后面的乘机.实际上二者的关系非常简单, Sn+1 = Sn \* Pn/ Pn-1. Sn 代表第 n 项的前后缀积, Pn 代表第 n 项的值.

更正不许用除法,无效解法

改为分开计算前后缀的积.

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int[] prefix = new int[nums.length];
        int[] suffix = new int[nums.length];
        int[] answer = new int[nums.length];
        //分别计算前缀积和后缀积
        prefix[0] = 1;
        for (int i = 1; i < prefix.length; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        suffix[nums.length - 1] = 1;
        for (int i = suffix.length - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }

        for(int i = 0; i < nums.length; i++) {
            answer[i] = prefix[i] * suffix[i];
        }
        return answer;
    }
}
```

# [**155. 最小栈**](https://leetcode.cn/problems/min-stack/)

设计一个支持  `push` ，`pop` ，`top`  操作，并能在常数时间内检索到最小元素的栈。

实现  `MinStack`  类:

- `MinStack()`  初始化堆栈对象。
- `void push(int val)`  将元素 val 推入堆栈。
- `void pop()`  删除堆栈顶部的元素。
- `int top()`  获取堆栈顶部的元素。
- `int getMin()`  获取堆栈中的最小元素

思路: 原本是想着维护一个全局的最小元素的值, 每次插入时比较二者大小. 问题是当 pop 的元素是最小元素的时候, 需要重新遍历一次栈找到最小值.

看了提示, 给栈的每个元素加上一个最小值元素, 代表这个元素以下的栈的最小元素.

天才般的想法.

```java
class MinStack {

    /**
     * 1. 修正 Node 类：
     * - 设为 private，封装实现细节。
     * - 添加 `min` 字段！这
     * - 构造函数改为接收 value, min, 和 prev 节点。
     */
    private class Node {
        int value; // 当前节点的值
        int min;   // 到达这个节点为止，栈中的最小值
        Node prev; // 指向它下面的节点

        Node(int value, int min, Node prev) {
            this.value = value;
            this.min = min;
            this.prev = prev;
        }
    }

    /**
     * 2. 修正 MinStack 类：
     * - 使用 `head` (或 `top`) 来表示栈顶，初始化为 null。
     */
    private Node head;

    // 构造函数：初始化一个空栈
    public MinStack() {
        head = null;
    }

    // push 操作 (O(1))
    public void push(int val) {
        if (head == null) {
            // 栈是空的，val 就是第一个值，也是第一个最小值
            head = new Node(val, val, null);
        } else {
            // 栈不是空的，新的 min 是 "当前值" 和 "上一个 min" 之间的较小者
            int newMin = Math.min(val, head.min);
            // 创建新节点，它的 prev 指向旧的 head
            Node newNode = new Node(val, newMin, head);
            // head 指针移动到新节点上
            head = newNode;
        }
    }

    // pop 操作 (O(1))
    public void pop() {
        // (在实际工程中，你应检查 head != null，防止空栈 pop)
        // head 指针回滚到上一个节点
        head = head.prev;
    }

    // top 操作 (O(1))
    public int top() {
        // (在实际工程中，你应检查 head != null)
        return head.value;
    }

    // getMin 操作 (O(1))
    public int getMin() {
        // (在实际工程中，你应检查 head != null)
        // 这就是魔法所在：直接返回 head 节点的 min 记录
        return head.min;
    }
}
```

# [**15. 三数之和**](https://leetcode.cn/problems/3sum/)

给你一个整数数组  `nums` ，判断是否存在三元组  `[nums[i], nums[j], nums[k]]`  满足  `i != j`、`i != k`  且  `j != k` ，同时还满足  `nums[i] + nums[j] + nums[k] == 0` 。请你返回所有和为  `0`  且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。

第一次面试的题,没写出来

面试的思路是将数组排序, 再分成正负 0 三种类型数组. 有- - +, - 0 +, -++三种情况, 分成三种情况讨论.

实现的时候感觉三层嵌套加三种情况太复杂了, 一下子想不出来. 唉.寄了

现在知道三个指针完全可以做到和三层嵌套一样的效果, 复杂度还不高.

思路: 维护三个指针, 一个代表当前第一个元素(为负数), 另一个代表第二个数, 可为正负 0. 另一个为正数.

将数组排序

第一个指针从第一个元素(即最小的元素)开始, 并判断是否为负.非负的话不用考虑.

第二个指针从第一个指针右边第一个元素开始.

第三个指针从右侧第一个开始(最大的). 并检查是否为正.

计算三个指针元素之和, 如果值为负, 说明第一个和第二个指针之和不可能有元素加上为 0.因此改变第二个指针,向右移动一个, 第三个指针回到最右侧. 如果值为正, 说明第三个太大, 向左移动. 要注意边界处理. 如果值为 0,说明找到了,保存,并移动第二指针, 重置第三指针. 当第二第三两个指针相遇时,说明以及遍历完所有可能情况, 移动第一指针.

重复情况的处理, 移动的时候查看是否当前元素与之前元素重复, 若重复跳过该元素, 再移动一次.

还是想的太复杂了, 应该先从这个算法最简洁的层面来 i 想,也就是第一个指针遍历 n-3 个元素, 后两个指针共同遍历 n-1 个元素. 因此一共遍历 n^2 次.后两个指针根据和的值来判断哪个移动,直到二者交合.

处理重复的方法: 所有指针在移动的过程,跳过重复元素.因此所有重复的元组都不会被遍历.

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        int left, middle, right;
        Arrays.sort(nums);
        List<List<Integer>> answer = new ArrayList<>();
        Integer leftPrev = null;  // 使用 Integer 类型，可以表示"未初始化"
        for (left = 0; left < nums.length; left++) {
            if (leftPrev != null && nums[left] == leftPrev) {
                continue;
            }
            leftPrev = nums[left];
            middle = left + 1;
            right = nums.length - 1;
            while (middle < right) {
                int sum = nums[left] + nums[right] + nums[middle];
                if (sum == 0) {
                    List<Integer> tuple = new ArrayList<>();
                    tuple.add(nums[left]);
                    tuple.add(nums[middle]);
                    tuple.add(nums[right]);
                    answer.add(tuple);
                    //移动middle直到不是相同元素
                    int prev = nums[middle];
                    middle += 1;
                    while(middle < nums.length - 1 && prev == nums[middle]) {
                        middle += 1;
                    }
                    right = nums.length - 1;
                } else if (sum < 0) {
                    int prev = nums[middle];
                    middle += 1;
                    while(middle < right && prev == nums[middle]) {
                        middle += 1;
                    }
                } else {
                    int prev = nums[right];
                    right -= 1;
                    while(middle < right && prev == nums[right]) {
                        right -= 1;
                    }
                }
            }

        }
        return answer;

    }

    public static void main(String[] args) {
        Solution solution = new Solution();

        // 测试用例1: 标准测试
        int[] nums1 = {0,0,0};
        System.out.println("测试用例1: " + Arrays.toString(nums1));
        System.out.println("结果: " + solution.threeSum(nums1));
        System.out.println();


    }
}

```

思路二: 三层循环遍历, 用 hashset 去重. 复杂度 O(n^3).

# [**152. 乘积最大子数组**](https://leetcode.cn/problems/maximum-product-subarray/)

中等

给你一个整数数组  `nums` ，请你找出数组中乘积最大的非空连续   子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个  **32-位**  整数。

**请注意**，一个只包含一个元素的数组的乘积是这个元素的值

思路: 暴力解法:维护一个乘机数组, p[i][j]代表元素 i 到元素 j 的乘积. 从一个元素开始,逐步累加元素数量,

p[i][j] = p[i][j-1] \*p[j][j]. 一共计算 n^2 次.寻找其中的最大值.

超出内存限制, 考虑优化数组. 发现每一个 p[i][j]只依赖前面的 p[i][j - 1] , 因此只保存前面的计算结果,不保存数组.

```
class Solution {
    public int maxProduct(int[] nums) {
        int res = Integer.MIN_VALUE;
        for(int i = 0; i < nums.length; i++) {
            int product = 1;
            for(int j = i; j < nums.length; j++) {
                product *= nums[j];
                res = Math.max(product, res);
            }
        }
        return res;
    }
}
```

这个方法是把所有可能的乘积都计算出来找最大.

所以有很多不必要的重复计算.

动态规划: 计算以元素 i 结尾的最大乘积, 可以利用到以元素 i-1 结尾的最大乘积.

dp[i] = max(dp[i - 1]\*nums[i], nums[i]).

问题在于如果 nums[i]等于负数, 前面的最大乘积没有用, 而是最小乘积才有用.因此记录对于前一个元素记录两个值:最大乘积和最小乘积.

动态规划关键在于找到问题的状态是怎么转移的.

```java
class Solution {
    public int maxProduct(int[] nums) {
       //max,min代表以i元素结尾的最大/小乘积
       int res = Integer.MIN_VALUE;
       int[] max = new int[nums.length];
       int[] min = new int[nums.length];
       max[0] = nums[0];
       min[0] = nums[0];
       res = max[0];
       for (int i = 1; i < nums.length; i++) {
           if (nums[i] >= 0) {
            max[i] = Math.max(max[i - 1] * nums[i], nums[i]);
            min[i] = Math.min(min[i - 1] * nums[i], nums[i]);

           } else {
            max[i] = Math.max(min[i - 1] * nums[i], nums[i]);
            min[i] = Math.min(max[i - 1] * nums[i], nums[i]);
           }
           res = Math.max(res, max[i]);
       }
       return res;
    }
}
```

# [**148. 排序链表**](https://leetcode.cn/problems/sort-list/)

中等

给你链表的头结点  `head` ，请将其按  **升序**  排列并返回  **排序后的链表**

思路: 第一想法把链表转成数组, 排序. O(nlogn) O(n). 随手一试,还真通过了 : )

进阶:常数空间. O(nlogn)时间.

O(nlog'n)的时间, 有两种可能快速排序和合并排序, 快排不太好实现, mergesort 尝试.

怎么把单链表分成两半?

用一快一慢双指针, 快的一次两个, 慢的一次一个, 直到快的下一个为 null.

这样就有一个指针指向第一半的末尾, 以及第二半的末尾, 便可知第二版的开头, 第一版的开头本来就直到. 这样分解,直到剩下一个元素,在合并两个链表从头元素开始, 比较大小, 以一个链表为主题插入另外一个.

插入操作可以优化, 使用一个哨兵节点, 就不用再原链表上进行插入的操作, 避免繁琐的逻辑.

```java
class Solution {
    /**
     * 对链表进行归并排序
     * 时间复杂度: O(n log n)
     * 空间复杂度: O(log n) - 递归调用栈
     */
    public ListNode sortList(ListNode head) {
        // 基本情况：空链表或只有一个节点
        if (head == null || head.next == null) {
            return head;
        }

        // 1. 使用快慢指针找到链表中点
        ListNode mid = getMid(head);
        ListNode rightHead = mid.next;
        mid.next = null;  // 断开链表

        // 2. 递归排序左右两部分
        ListNode left = sortList(head);
        ListNode right = sortList(rightHead);

        // 3. 合并两个有序链表
        return merge(left, right);
    }

    /**
     * 使用快慢指针找到链表的中间节点
     * 如果有两个中间节点，返回第一个
     */
    private ListNode getMid(ListNode head) {
        ListNode slow = head;
        ListNode fast = head.next;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        return slow;
    }

    /**
     * 合并两个有序链表
     */
    private ListNode merge(ListNode l1, ListNode l2) {
        // 使用哨兵节点简化操作
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;

        // 比较两个链表的节点值，将较小的接到结果链表后
        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                curr.next = l1;
                l1 = l1.next;
            } else {
                curr.next = l2;
                l2 = l2.next;
            }
            curr = curr.next;
        }

        // 连接剩余部分
        if (l1 != null) {
            curr.next = l1;
        }
        if (l2 != null) {
            curr.next = l2;
        }

        return dummy.next;
    }
}
```

目前涉及递归,栈最深 logn.因此需要额外 logn 的空间保存栈帧. 也可以用迭代的方法做到 O(1).但是我累了,就这样吧.

# [**146. LRU 缓存**](https://leetcode.cn/problems/lru-cache/)

中等

请你设计并实现一个满足   [LRU (最近最少使用) 缓存](https://baike.baidu.com/item/LRU)  约束的数据结构。

实现  `LRUCache`  类：

- `LRUCache(int capacity)`  以  **正整数**  作为容量  `capacity`  初始化 LRU 缓存
- `int get(int key)`  如果关键字  `key`  存在于缓存中，则返回关键字的值，否则返回  `1` 。
- `void put(int key, int value)`  如果关键字  `key`  已经存在，则变更其数据值  `value` ；如果不存在，则向缓存中插入该组  `key-value` 。如果插入操作导致关键字数量超过  `capacity` ，则应该  **逐出**  最久未使用的关键字。

函数  `get`  和  `put`  必须以  `O(1)`  的平均时间复杂度运行

可以用 hashmap 来保存键值对数据, 再检查 hashmap 容量是否超过 capacity, 如果是, 就遍历键值对, 将最近最少访问的元素驱逐出去.

想简单了, 驱逐操作要 O(1).hashmap 数据无序.无法做到这一点.

改进: hashmap + 双向链表.

value 的结构改为双向链表的节点, 同时在加上 head tail 两个哨兵节点.

难度在于想出 hashmap 和双向链表共同维护. 一个为了快速查找, 一个为了快速驱逐. 我之前的想法是记录 time, 然后选择最小的 time 驱逐.但是不如用链表本身顺序来表示访问先后.选择最小的时间无法做到 O(1).

```java
import java.util.HashMap;

public class Node {
    Node prev;
    Node next;
    int value;
    int key;
    public Node(Node prev, Node next, int value, int key) {
        this.next = next;
        this.prev = prev;
        this.value = value;
        this.key = key;
    }

    public static void main(String[] args) {
        // 测试 LRUCache
        LRUCache cache = new LRUCache(2);

        cache.put(1, 1);
        cache.put(2, 2);
        System.out.println("get(1): " + cache.get(1));       // 返回 1
        cache.put(3, 3);    // 该操作会使得键 2 作废
        System.out.println("get(2): " + cache.get(2));       // 返回 -1 (未找到)
        cache.put(4, 4);    // 该操作会使得键 1 作废
        System.out.println("get(1): " + cache.get(1));       // 返回 -1 (未找到)
        System.out.println("get(3): " + cache.get(3));       // 返回 3
        System.out.println("get(4): " + cache.get(4));       // 返回 4
    }
}
class LRUCache {
    public Node head;
    public Node tail;
    public HashMap<Integer, Node> hashMap;
    public int capacity;
    public LRUCache(int capacity) {
        head = new Node(null, null, -1, -1);
        tail = new Node(null, null, -1, -1);
        head.next = tail;
        tail.prev = head;
        hashMap = new HashMap<>();
        this.capacity = capacity;
    }

    public int get(int key) {
        //将查找过的元素移动到表头.
        Node node = hashMap.get(key);
        if (node == null) {
            return -1;
        }
        node.prev.next = node.next;
        node.next.prev = node.prev;

        node.prev = head;
        node.next = head.next;

        head.next.prev = node;
        head.next = node;
        return node.value;
    }

    public void put(int key, int value) {
        //先检查key是否存在,若存在修改值并移动到顶端.
        Node ExNode = hashMap.get(key);
        if (ExNode != null) {
            ExNode.prev.next = ExNode.next;
            ExNode.next.prev = ExNode.prev;

            ExNode.prev = head;
            ExNode.next = head.next;

            head.next.prev = ExNode;
            head.next = ExNode;
            ExNode.value = value;
            return;
        }
        //先检查元素数量, 若需要驱逐, 将tail的prev指向上一个.
        //并在hashmap消除键值对
        if (hashMap.size() >= capacity) {
            hashMap.remove(tail.prev.key);
            tail.prev = tail.prev.prev;
            tail.prev.next = tail;
        }
        //增加元素,并将其加到链表顶端
        Node node = new Node(head, head.next, value, key);
        head.next = node;
        node.next.prev = node;
        hashMap.put(key, node);
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
```

# [**142. 环形链表 II**](https://leetcode.cn/problems/linked-list-cycle-ii/)

给定一个链表的头节点  `head` ，返回链表开始入环的第一个节点。 *如果链表无环，则返回  `null`。*

如果链表中有某个节点，可以通过连续跟踪  `next`  指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数  `pos`  来表示链表尾连接到链表中的位置（**索引从 0 开始**）。如果  `pos`  是  `-1`，则在该链表中没有环。**注意：`pos`  不作为参数进行传递**，仅仅是为了标识链表的实际情况。

**不允许修改**  链表。

解法 1: 使用 set 添加链表元素, 遇到第一个重复的元素就是入口. 缺点空间 O(n)

解法 2:快慢指针, 一个进一, 一个进二, x 是 head 到入口步数, y 是环形走一圈的步数. 可以计算出二者交集处固定为 y 索引处(同余式). 该处的点走 x 步刚好到环形链表入口. 但是并不知道 x 是多少, 因此从表头搞一个指针同步走, 二者相遇即为入口.

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* detectCycle(ListNode* head) {
        ListNode* meetNode = isCycle(head);
        if (meetNode == nullptr) {
            return nullptr;
        }
        ListNode* x, *y;
        x = head;
        y = meetNode;
        while (x != y) {
            x = x->next;
            y = y->next;
        }

        return x;

    }

    ListNode* isCycle(ListNode* head) {
        ListNode* fast  = head;
        ListNode* slow = head;
        while (fast != nullptr && fast->next != nullptr && slow != nullptr) {
            fast = fast->next->next;
            slow = slow->next;
            if (fast == slow) {
                return fast;
            }
        }
        return nullptr;
    }
};
```

# [**139. 单词拆分**](https://leetcode.cn/problems/word-break/)

给你一个字符串  `s`  和一个字符串列表  `wordDict`  作为字典。如果可以利用字典中出现的一个或多个单词拼接出  `s`  则返回  `true`。

**注意：**不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

思路: 使用 trie 来保存字典, 实现高效的查找.

查找的过程怎么搞: 一个 s 可能由多个单词组成. 可以从头开始有一个字符若有在添加下一个,直到找到 word, 将字符串清空, 从下一个字符开始添加, 直到末尾.

问题:字符串会添加后续元素如果重新查找 word 重复操作多, 因此可以在 trie 的树结构上找.

可能会有多个 word 与 s 中的部分字符串匹配,怎么解决? 将多种情况产生的后缀加入队列, 依次出队列处理.

改进:由于队列中的字符串可能有很多重复的, 改用 set 存储,即加快了速度也节省了空间.

时间复杂度 O(n^2 logn)

```cpp
# include <iostream>
# include <string>
# include <queue>
# include <set>
# include <vector>
using namespace std;

class Node {
    public:
        char value;
        bool isKey;
        Node* childs[26];
        Node() {
            value = '\0';
            isKey = false;
            for (int i = 0; i < 26; i++) {
            childs[i] = nullptr;
            }
        }
};
class Trie {
public:
    Node* root;
    Trie() {
        root = new Node();

    }

    ~Trie() {
        // 需要释放内存
        deleteNode(root);
    }



    void insert(string word) {
        Node* curr = root;
        for(int i = 0; i < word.size(); i++) {
            if (curr->childs[word[i] - 'a'] == nullptr) {
                curr->childs[word[i] - 'a'] = new Node();
                curr = curr->childs[word[i] - 'a'];
                curr->value = i;
            } else {
                curr = curr->childs[word[i] - 'a'];
            }
        }
        curr->isKey = true;
    }

    bool search(string word) {
        Node* curr = root;
        for(int i = 0; i < word.size(); i++) {
            if (curr->childs[word[i] - 'a'] == nullptr) {
                return false;
            } else {
                curr = curr->childs[word[i] - 'a'];
            }
        }
        return curr->isKey;
    }

    bool startsWith(string prefix) {
        Node* curr = root;
        for(int i = 0; i < prefix.size(); i++) {
            if (curr->childs[prefix[i] - 'a'] == nullptr) {
                return false;
            } else {
                curr = curr->childs[prefix[i] - 'a'];
            }
        }
        return true;
    }

    bool multiSearch(string words) {
        //给定一个字符串, 判断是否由字典中的word组成
        //使用set保存用来判断的后缀(避免重复字符串导致内存超限)
        set<string> suffixSet;
        suffixSet.insert(words);

        while(!suffixSet.empty()){
            // 从set中取出一个字符串
            string str = *suffixSet.begin();
            suffixSet.erase(suffixSet.begin());

            Node* curr = root;
            //匹配word
            bool success = true;
            for(int i = 0; i < str.size(); i++) {
                if (curr->childs[str[i] - 'a'] == nullptr) {
                    //匹配不到退出循环
                    success = false;
                    break;
                } else {
                    curr = curr->childs[str[i] - 'a'];
                    if (curr->isKey) {
                        //如果是word将除去word的后缀加入suffixSet
                        //截取后缀
                        string suf = str.substr(i + 1);
                        // set会自动去重，避免重复字符串
                        suffixSet.insert(suf);
                    }
                }
            }
            //判断是否匹配成功且是word若是说明成功
            if(success && curr->isKey) {
                return true;
            }
        }
        return false;
    }
    private:
    void deleteNode(Node* node) {
        if (!node) return;
        for (Node* child : node->childs) {
            deleteNode(child);
        }
        delete node;
    }
};

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        //创建trie并添加word.
        Trie trie = Trie();
        for(string word : wordDict) {
            trie.insert(word);
        }
        return trie.multiSearch(s);

    }
};

int main() {
    Solution solution;

    // 测试用例 4 - 自定义测试
    vector<string> wordDict4 = {"aaaa", "aa"};
    string s4 = "aaaaaaa";
    bool result4 = solution.wordBreak(s4, wordDict4);
    cout << "测试4: \"" << s4 << "\" -> " << (result4 ? "true" : "false") << endl;

    return 0;
}
```

方法二:动态规划

dp[i]表示前 i 位的元素可不可以由 word 组成.

dp[j] = 存在 i, dp[i] && [i-j]的元素是一个 word

dp 的计算过程: dp[0] = true. dp[1] = dp[0] && 0-1 的元素(即第一个)是一个 word.

dp[2] = dp[0]&&0-2 元素是 word || dp[1] && 1-2 元素是 word.

….

可见计算 dp[i]要计算 i 次元素是不是在 word. 用 hash 表等结构可以做到 O(1)查找,因此时间复杂度 O(n^2)

感觉每次 dp 的解法都想不到, 主要在于没有利用将问题分解成子问题.这题是判断源字符串是不是有 word 组成的.就可以分解成前 i 位的元素可以有 word 组成, 后缀元素也可以有 word 组成.

```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        n=len(s)
        dp=[False]*(n+1)
        dp[0]=True
        for i in range(n):
            for j in range(i+1,n+1):
                if(dp[i] and (s[i:j] in wordDict)):
                    dp[j]=True
        return dp[-1]
作者：吴彦祖
链接：https://leetcode.cn/problems/word-break/solutions/50986/dong-tai-gui-hua-ji-yi-hua-hui-su-zhu-xing-jie-shi/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

# [**136. 只出现一次的数字**](https://leetcode.cn/problems/single-number/)

简单

给你一个  **非空**  整数数组  `nums` ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。

思路: 没有思路.

先考虑暴力解法, 用 set 保存遍历的元素, 遇到相同元素将其除去, 最后留下的就是答案.

问题在于空间要是常数. 根据我做[https://www.notion.so/0f0657e805d0485eb2ca2753d4937b47?source=copy_link#29b651e18f6080bf896dfef14a0a644a](多数元素) 多数元素的经验, 这种情况时要在数组上做操作.

看了下提示, 用异或操作. 研究了下异或操作的性质, 发现对输入数组做异或操作, 值总是那个唯一元素. 进一步发现异或对自己异或总是得到 0, 对 0 异或总是得到自己.因此对数组异或得到唯一元素是合理的, 但是还要证明 xor 是满足交换律和结合律的. 交换律好理解, 这个运算对位置没有关系. 结合律:运算的先后似乎也没有影响,但是我没有证明.

```java
class Solution {
    public int singleNumber(int[] nums) {
        int res = nums[0];
        for (int i = 1; i < nums.length; i++) {
            res = res ^ nums[i];
        }
        return res;
    }
}
```

xor 实际上可以看成奇偶校验器.1 的个数为奇数结果为 1, 个数为偶数为 0.因此与计算的先后没有影响.

解法二: 取余法.参考下一题.注意取余法相比 xor 是较慢的.

# [**137. 只出现一次的数字 II**](https://leetcode.cn/problems/single-number-ii/)

中等

给你一个整数数组  `nums` ，除某个元素仅出现  **一次**  外，其余每个元素都恰出现  **三次 。**请你找出并返回那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法且使用常数级空间来解决此问题。

取余法: 将数字看成二进制, 将所有数字的位相加, 可以得到 i 位上 1 的数量. 再将该数量取余 3, 得到的余数就是只出现一次的数字在该位上的值.对所有位执行这样的操作即可得到该数的二进制值.

```java
class Solution {
    public int singleNumber(int[] nums) {
        //将所有位的值相加
        int res = 0;
        for(int i = 0; i < 32; i++) {
            int sum = 0;
            for (int num : nums) {
                int val = num >> i & 1;
                sum += val;
            }
            int bit = sum % 3;
            res = res | (bit << i);
        }
        return res;
    }
}
```

# [**647. 回文子串**](https://leetcode.cn/problems/palindromic-substrings/)

中等

给你一个字符串  `s` ，请你统计并返回这个字符串中  **回文子串**  的数目。

**回文字符串**  是正着读和倒过来读一样的字符串。

**子字符串**  是字符串中的由连续字符组成的一个序列。

思路: 动态规划: dp[i][j]代表从 i 到 j 的元素是否组成回文.

对于 i,j 相隔大与 2 的, dp[i][j] = nums[i] == nums[j] && dp[i + 1][j-1].

按照 i,j 相隔长度大小依次遍历, 遇到 dp 为 1,计数加 1. O(n^2) O(n^2)

```java
class Solution {
    public int countSubstrings(String s) {
        boolean[][] dp = new boolean[s.length()][s.length()];
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            dp[i][i] = true;
            count += 1;
        }
        for (int i = 0; i < s.length() - 1; i++) {
            if (s.charAt(i + 1) == s.charAt(i)) {
                dp[i][i+1] = true;
                count += 1;
            }
        }
        for (int length = 3; length <= s.length(); length++) {
            for (int i = 0; i < s.length() - length + 1; i++) {
                if(dp[i + 1][i + length - 2] && s.charAt(i) == s.charAt(i + length - 1)) {
                    dp[i][i + length - 1] = true;
                    count += 1;
                }
            }
        }
        return count;
    }
}
```

空间优化:因为每次计算 dp 只需要当前长度减 2 的 dp 值, 因此只需保存前两个长度的 dp.可以将空间复杂度将为 O(n).

我这种解法计算 dp 的顺序是按照对角线来计算. 还有从别的计算顺序,但是要注意 dp 之间的依赖关系.

第二种解法:中心点扩展. 从所有可能的中心开始扩展, 扩展两边的字符相等即找到了一个回文子串. 这个方法主要是中心点的选取, 不仅每个单个字符是, 每个相邻双字符也是.时间也是 O(n^2) 空间 O(1)

# [**5. 最长回文子串**](https://leetcode.cn/problems/longest-palindromic-substring/)

给你一个字符串  `s`，找到  `s`  中最长的   回文   子串。

顺带秒了.

# [**128. 最长连续序列**](https://leetcode.cn/problems/longest-consecutive-sequence/)

给定一个未排序的整数数组  `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为  `O(n)` \*\*的算法解决此问题。

**思路**:暴力解法肯定是将数组排序, 时间 O(nlogn). 但是排序与判断是否连续似乎并不必要.对于这道题排序的意义在于快速找到连续的元素(排完序后应该相邻).因此想到用 hash 表存储数字, 也能达到 O(1)的查找速度.

将每个数字添加到 hash 表中便于查找. 遍历每个数字, 在 hash 表查找其下一个连续数字,若找到,继续下一个查找. 直到查找不到, 换个方向继续查找.

这里有几个问题: 对于已经查找过的元素, 没有必要在以它为中心在查找一遍. 第二, 元素可能重复.

解决办法以元素为 key, 次数为 value, 用 hashmap 存储. 每次查找到的元素将其从 hahsmap 中删除,代表已经查找过了. 这里可以直接删除的原因是同一个元素不需要被查找两次, 如果被查找两次, 说明它是两个元素的连续元素, 因此这两个元素也是连续的, 因此其中一个也会被查找到.

更正:这里理解错题意了相同的元素不重复计算, 因此用一个 hashset 就行.

**实现**: 遍历一遍数组, 将数组元素加入到 hashset 中. 在从头遍历一次, 先查找当前元素, 如果存在,长度加 1, 并将记录删除, 继续下一个. 直到找不到再反向查找.

```java
import java.util.HashSet;

class Solution {
    public int longestConsecutive(int[] nums) {
        HashSet<Integer> numSet = new HashSet<>();
        // 将所有元素添加进 HashSet（自动去重）
        for (int num : nums) {
            numSet.add(num);
        }

        int maxLength = 0;

        // 遍历元素查找连续序列
        for (int num : nums) {
            // 如果元素不存在，说明已经查找过，跳过
            if (!numSet.contains(num)) {
                continue;
            }

            // 查找后删除当前元素
            numSet.remove(num);
            int length = 1;

            // 向右查找连续大于它的元素
            int currNum = num + 1;
            while (numSet.contains(currNum)) {
                numSet.remove(currNum);
                length++;
                currNum++;
            }

            // 向左查找连续小于它的元素
            currNum = num - 1;
            while (numSet.contains(currNum)) {
                numSet.remove(currNum);
                length++;
                currNum--;
            }

            maxLength = Math.max(maxLength, length);
        }

        return maxLength;
    }
}
```

# [**124. 二叉树中的最大路径和**](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

二叉树中的  **路径**  被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中  **至多出现一次** 。该路径  **至少包含一个**  节点，且不一定经过根节点。

**路径和**  是路径中各节点值的总和。

给你一个二叉树的根节点  `root` ，返回其  **最大路径和** 。

思路: 将每个节点的左右子树对应的最大的路径和分别计算并保存起来.计算以该节点为根节点的最大路径和就将其左右子树相加并加上自己的值. 遍历所有节点为根节点,找到最大的.

首先是计算所有节点其左右子树最大最大路径和但是不能拐弯.

用

# [**124. 二叉树中的最大路径和**](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

二叉树中的  **路径**  被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中  **至多出现一次** 。该路径  **至少包含一个**  节点，且不一定经过根节点。

**路径和**  是路径中各节点值的总和。

给你一个二叉树的根节点  `root` ，返回其  **最大路径和** 。

思路: 将每个节点的左右子树对应的最大的路径和分别计算并保存起来.计算以该节点为根节点的最大路径和就将其左右子树相加并加上自己的值. 遍历所有节点为根节点,找到最大的.

首先是计算所有节点其左右子树最大最大路径和但是不能拐弯.

先用 dfs,从叶子节点开始, 其左右子树路径和都为 0, 其最大路径和是自己的值. 然后是其父节点, 其父节点的最大路径和是两个子树路径和相加(如果负数没有必要加), 其对父节点的作用是其值加上左右子树中最大的路径和, 把他的值修改成这个. 继续向上

后序遍历, 先计算每个子树的路径和, 再计算自己的. 并于当前最大比较.

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    int maxSum;
    public int maxPathSum(TreeNode root) {
        //后序遍历
        maxSum = Integer.MIN_VALUE;
        dfs(root);
        return maxSum;
    }
    public void dfs(TreeNode root) {
        if (root == null) {
            return;
        }
        //叶节点, 其最大路径和是自己. 以及子路径也是自己
        if (root.left == null && root.right == null) {
            maxSum = Math.max(maxSum, root.val);
            return;
        }
        // 先找左右子树, 在计算最大路径和
        dfs(root.left);
        dfs(root.right);
        int maxPath = root.val;
        int maxChild = 0;
        if (root.left != null && root.left.val > 0) {
            maxPath += root.left.val;
            maxChild = Math.max(maxChild, root.left.val);
        }
        if (root.right != null && root.right.val > 0) {
            maxPath += root.right.val;
            maxChild = Math.max(maxChild, root.right.val);
        }
        maxSum = Math.max(maxSum, maxPath);
        //修改当前值为 子路径和
        root.val = maxChild + root.val;
    }
}
```

# [**Q26. 零钱兑换**](https://leetcode.cn/problems/coin-change/)

给你一个整数数组  `coins` ，表示不同面额的硬币；以及一个整数  `amount` ，表示总金额。

计算并返回可以凑成总金额所需的  **最少的硬币个数** 。如果没有任何一种硬币组合能组成总金额，返回  `-1` 。

你可以认为每种硬币的数量是无限的。

思路:

动态规划: dp[i] 代表 amount = i, 要找的硬币最小数量.

状态转移方程:dp[i] = min(dp[i - coin[j]]….) + 1;

真个程序的结构就是从 amount 开始, 求 amount - coin 的 dp 值,再从中选择最小的. 应为 dp 值可能没有计算,所以用来递归的方式来处理.

```java
class Solution {
    int[] dp;
    public int coinChange(int[] coins, int amount) {
        //初始话dp maxvalue
        dp = new int[amount + 1];
        //初始化dp元素为-1
        Arrays.fill(dp, -1);
        dp[0] = 0;
        int res = findDP(coins, amount);
        return res == Integer.MAX_VALUE ? -1 : res;
    }

    public int findDP(int[] coins, int amount) {
        if (dp[amount] != -1) {
            return dp[amount];
        }
        int minValue = Integer.MAX_VALUE;
        //遍历每个零钱,计算dp[i - coin]
        for (int coin : coins) {
            int newAmount = amount - coin;
            if (newAmount >= 0) {
                minValue = Math.min(minValue, findDP(coins, newAmount));
            }
        }
        //minvalue 为MAX代表找不开
        if (minValue == Integer.MAX_VALUE) {
            dp[amount] = minValue;
        } else {
            dp[amount] = minValue + 1;
        }

        return dp[amount];
    }
}
```
