import { Stack } from "expo-router";

export default function FoldersLayout() {
    return (
        <Stack>
            {/* list all folders */}
            <Stack.Screen name="index" options={{ title: "Folders" }} />

            {/* route for /folders/create */}
            <Stack.Screen
                name="create"
                options={{ title: "New Folder" }}
            />

            {/* route for /folders/[foldersId]/index */}
            <Stack.Screen
                name="[foldersId]/index"
                options={{
                    headerBackTitle: "Folders",
                }}
            />

            {/* route for create-card inside folder */}
            <Stack.Screen
                name="[foldersId]/create-card"
                options={{
                    title: "Add Gift Card",
                    presentation: "modal",
                }}
            />

            {/* route for individual card detail */}
            <Stack.Screen
                name="[foldersId]/cards/[cardId]"
                options={{
                    title: "",
                }}
            />
        </Stack>
    );
}




