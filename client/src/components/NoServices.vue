<template>
    <div class="mt-6">
        <p class="is-size-4">
            You have no services, please enable at least one.
        </p>
        <b-button
            @click="$store.commit('setmodalServices')"
            type="is-link is-light"
            class="mt-4"
            >Enable a service</b-button
        ><br />
    </div>
</template>

<script>
export default {
    name: 'NoServices',
};
</script>

<style>
</style>