<template>
  <div>
    <ul class="bookList">
      <li v-for="(item, index) in bookList" :key="index">
        <div class="cover">
          <img :src="item.cover" />
        </div>
        <div class="body">
          <h2>
            <a :href="item.link" target="_blank">{{ item.title }}</a>
          </h2>
          <h3>
            {{ item.author }}
          </h3>
          <p>
            {{ item.description }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useData } from "vitepress";

const { frontmatter } = useData();
const { bookList } = frontmatter.value;
console.log(bookList);
</script>

<style lang="scss" scoped>
.bookList {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    margin-bottom: 60px;
    .cover {
      width: 160px;
      height: 230px;
      margin-right: 20px;
      box-shadow: 0px 3px 5px #999;
      border-radius: 5px;
      img {
        width: 160px;
        height: 230px;
        object-fit: cover;
        border-radius: 5px;
      }
    }
    .body {
      flex: 1;
      font-size: 16px;
      h2 {
        margin-top: 0;
        a {
          color: var(red);
          &:hover {
            color: red;
          }
        }
      }
      h3 {
        font-size: 14px;
      }
    }
  }
}
</style>
