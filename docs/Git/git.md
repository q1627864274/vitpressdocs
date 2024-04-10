---
outline: deep
---

2023/7/18  huawei

#### 查看当前分支绑定的远程分支

2023/7/18  huawei

```bash
git branch -vv

* 7.17       d450bd683 [origin/7.17] 
  Dev_V2R1   bdaf301f1 [upstream/Dev_V2R1] 
  chaoV1     2264b9f39 Merge branch 'dev_whd' into 'develop'
  chaoV2     bdaf301f1 [upstream/Dev_V2R1] 
  chaoV2_new 8b5aa3efb [upstream/Dev_V2R1_New: ahead 7, behind 82] 
  develop    48e02a3b9 [origin/develop: ahead 525] 
```

#### 个人仓向主仓提交Merge requests时候，发现代码冲突，这个时候怎么解决？

2023/7/18  huawei

```bash
1. 新创建一个分支，从个人仓库远程拉取最新的代码到本地
2. 从主仓库远程拉取最新的代码到本地
3. 打开VS Code，使用集成的Git工具来查看和解决代码冲突。VS Code会在冲突文件中显示冲突标记（类似于之前提到的<<<<<<< HEAD和>>>>>>> abcdef123456）。编辑文件以解决冲突，并删除冲突标记。
4. 在解决冲突后，保存文件并使用Git命令提交更改到个人仓库
5. 重新提交Merge requests
```

#### 本地分支拉错远端分支代码

2023/7/18  huawei

```bash
1. git reflog 
   会显示你在本地仓库进行的所有操作，包括拉取、合并和提交等。
2. git reset --hard <commit-hash>
   这将使本地分支回退到指定的提交，恢复到你拉错远端分支之前的状态。
```

#### 向主仓的提交的merge只有一个commit

2023/7/20  huawei

1. 在本地提交commit的时候，进行处理

```bash
新接到需求，需要基于master分支拉取一个feature分支，且这个feature分支只有你自己使用（这一点极其重要），由于开发周期较长，你不想每一次都产生一个新的commit，而是每一次commit都修改前一次提交，这样做的好处是，等到你的feature分支提测时，就只有1个干净的commit，没有乱七八糟的提交历史，你只要把这1个commit合并到master里就好了。

解决办法：在feature分支上，

第1次提交代码时，使用git commit -am "第1次提交的注释"

第2次以后提交代码时，使用git commit --amend -m "这里填写提交的注释"

这样，整个分支可以只有1个commit。
```

#### 创建新分支并跟踪远端分支

2023/7/21  huawei

```js
git checkout -b masterV26 upstream/master_V2R1
// 创建一个名为 "chao2" 的新分支，并将工作目录切换到该分支上，同时跟踪        "upstream/master_poc" 远端分支
```

#### 常见命令总结

2023/7/21  huawei

```bash
git reset --soft HEAD^
此命令的作用是将当前分支的 HEAD 指针回退到上一个提交，同时保留回退后的更改文件

git push -f origin chao2
此命令的作用是将本地的 "chao2" 分支推送到远程仓库的同名分支，并使用强制推送来覆盖远程仓库中的提交历史。

git push origin -d chao2
此命令的作用是删除远程仓库中的 "chao2" 分支/tags。
```

#### 克隆远端仓库的某一个分支

2023/8/1  huawei

```js
git clone <远端仓库地址> -b <分支名>
```

#### 修改远端仓库名

2023/8/1  huawei

```js
git remote -v
git remote rename <old_name> <new_name>
```

#### 绑定远端仓库

2023/8/1  huawei

```js
 git remote add <别名> <远程仓库 URL>
```

#### 查看当前本地分支跟踪的是那个远端分支

2023/8/2  huawei

```js
git branch -vv
```

#### 删除本地分支，修改本地分支名

```js
要删除本地分支
git branch -D <branch_name>
修改本地分支名
git branch -m <旧分支名> <新分支名>
```




