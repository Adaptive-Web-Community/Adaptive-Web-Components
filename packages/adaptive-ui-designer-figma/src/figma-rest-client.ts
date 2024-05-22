import type * as FigmaRestAPI from "@figma/rest-api-spec";

enum HTTPMethods {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
}

interface RequestParams {
    queryParams?: Record<string, { toString(): string }>;
    bodyParams?: Record<string, { toString(): string }>;
    /**
     * @default HTTPMethods.GET
     */
    method?: HTTPMethods;
}

export class Client implements FigmaRESTClient {
    /**
     * Personal access token
     */
    #pat: string;

    /**
     * API Origin
     */
    #origin = "https://api.figma.com";

    /**
     * API version
     */
    #version = "v1";

    /**
     * Figma headers
     */
    #headers: HeadersInit;

    #apiPath: string = `${this.#origin}/${this.#version}`;

    private constructor(args: ClientArgs) {
        this.#pat = args.pat;
        this.#headers = {
            "X-Figma-Token": this.#pat,
        };
    }

    public static create(args: ClientArgs): FigmaRESTClient {
        return new Client(args)
    }

    public async getFile(
        pathParams: FigmaRestAPI.GetFilePathParams,
        queryParams?: FigmaRestAPI.GetFilePathParams | undefined
    ): Promise<FigmaRestAPI.GetFileResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}`);
        return this.fetch(url, { queryParams });
    }

    public async getFileNodes(
        pathParams: FigmaRestAPI.GetFileNodesPathParams,
        queryParams: FigmaRestAPI.GetFileNodesQueryParams
    ): Promise<FigmaRestAPI.GetFileNodesResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/nodes`);
        return this.fetch(url, { queryParams });
    }

    public async getImages(
        pathParams: FigmaRestAPI.GetImagesPathParams,
        queryParams?: FigmaRestAPI.GetImagesQueryParams | undefined
    ): Promise<FigmaRestAPI.GetImagesResponse> {
        const url = new URL(`${this.#apiPath}/images/${pathParams.file_key}`);
        return this.fetch(url, { queryParams });
    }

    public async getImageFill(
        pathParams: FigmaRestAPI.GetImageFillsPathParams
    ): Promise<FigmaRestAPI.GetImageFillsResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/images`);
        return this.fetch(url);
    }

    public async getComments(
        pathParams: FigmaRestAPI.GetCommentsPathParams,
        queryParams?: FigmaRestAPI.GetCommentsQueryParams | undefined
    ): Promise<FigmaRestAPI.GetCommentsResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/comments`);
        return this.fetch(url, { queryParams });
    }

    public async postComments(
        pathParams: FigmaRestAPI.PostCommentPathParams,
        bodyParams: FigmaRestAPI.PostCommentRequestBody
    ): Promise<FigmaRestAPI.Comment> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/comments`);
        return this.fetch(url, { bodyParams, method: HTTPMethods.POST });
    }

    public async deleteComments(
        pathParams: FigmaRestAPI.DeleteCommentPathParams
    ): Promise<FigmaRestAPI.DeleteCommentResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/${pathParams.comment_id}`);
        return this.fetch(url, { method: HTTPMethods.DELETE });
    }

    public async getCommentReactions(
        pathParams: FigmaRestAPI.GetCommentReactionsPathParams,
        queryParams?: FigmaRestAPI.GetCommentReactionsQueryParams | undefined
    ): Promise<FigmaRestAPI.GetCommentReactionsResponse> {
        const url = new URL(
            `${this.#apiPath}/files/${pathParams.file_key}/comments/${pathParams.comment_id}/reactions`
        );
        return this.fetch(url, { queryParams });
    }

    public async postCommentReactions(
        pathParams: FigmaRestAPI.PostCommentReactionPathParams,
        queryParams: FigmaRestAPI.PostCommentReactionRequestBody
    ): Promise<FigmaRestAPI.PostCommentReactionResponse> {
        const url = new URL(
            `${this.#apiPath}/files/${pathParams.file_key}/comments/${pathParams.comment_id}/reactions`
        );
        return this.fetch(url, { queryParams, method: HTTPMethods.POST });
    }

    public async deleteCommentReactions(
        pathParams: FigmaRestAPI.DeleteCommentReactionPathParams,
        queryParams?: FigmaRestAPI.DeleteCommentReactionQueryParams | undefined
    ): Promise<FigmaRestAPI.DeleteCommentReactionResponse> {
        const url = new URL(
            `${this.#apiPath}/files/${pathParams.file_key}/comments/${pathParams.comment_id}/reactions`
        );
        return this.fetch(url, { queryParams, method: HTTPMethods.DELETE });
    }

    public async getMe(): Promise<FigmaRestAPI.GetMeResponse> {
        const url = new URL(`${this.#apiPath}/me`);
        return this.fetch(url);
    }

    public async getVersion(
        pathParams: FigmaRestAPI.GetFileVersionsPathParams,
        queryParams?: FigmaRestAPI.GetFileVersionsQueryParams | undefined
    ): Promise<FigmaRestAPI.GetFileVersionsResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/versions`);
        return this.fetch(url, { queryParams });
    }

    public async getTeamProjects(
        pathParams: FigmaRestAPI.GetTeamProjectsPathParams
    ): Promise<FigmaRestAPI.GetTeamProjectsResponse> {
        const url = new URL(`${this.#apiPath}/teams/${pathParams.team_id}/projects`);
        return this.fetch(url);
    }

    public async getProjectFiles(
        pathParams: FigmaRestAPI.GetProjectFilesPathParams,
        queryParams?: FigmaRestAPI.GetProjectFilesQueryParams | undefined
    ): Promise<FigmaRestAPI.GetProjectFilesResponse> {
        const url = new URL(`${this.#apiPath}/projects/${pathParams.project_id}/files`);
        return this.fetch(url, { queryParams });
    }

    public async getTeamComponents(
        pathParams: FigmaRestAPI.GetTeamComponentsPathParams,
        queryParams?: FigmaRestAPI.GetTeamComponentsQueryParams | undefined
    ): Promise<FigmaRestAPI.GetTeamComponentsResponse> {
        const url = new URL(`${this.#apiPath}/teams/${pathParams.team_id}/components`);
        return this.fetch(url, { queryParams });
    }

    public async getFileComponents(
        pathParams: FigmaRestAPI.GetFileComponentsPathParams,
        queryParams: FigmaRestAPI.GetFilePathParams
    ): Promise<FigmaRestAPI.GetFileComponentsResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/components`);
        return this.fetch(url, { queryParams });
    }

    public async getComponent(
        pathParams: FigmaRestAPI.GetComponentPathParams
    ): Promise<FigmaRestAPI.GetComponentResponse> {
        const url = new URL(`${this.#apiPath}/components/${pathParams.key}`);
        return this.fetch(url);
    }

    public async getTeamComponentSets(
        pathParams: FigmaRestAPI.GetTeamComponentSetsPathParams,
        queryParams?: FigmaRestAPI.GetTeamComponentSetsQueryParams | undefined
    ): Promise<FigmaRestAPI.GetTeamComponentSetsResponse> {
        const url = new URL(`${this.#apiPath}/teams/${pathParams.team_id}/component_sets`);
        return this.fetch(url, { queryParams });
    }

    public async getFileComponentSets(
        pathParams: FigmaRestAPI.GetFileComponentSetsPathParams,
        queryParams?: FigmaRestAPI.GetFileQueryParams
    ): Promise<FigmaRestAPI.GetFileComponentSetsResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/component_sets`);
        return this.fetch(url, { queryParams });
    }

    public async getComponentSets(
        pathParams: FigmaRestAPI.GetComponentSetPathParams
    ): Promise<FigmaRestAPI.GetComponentSetResponse> {
        const url = new URL(`${this.#apiPath}/components_sets/${pathParams.key}`);
        return this.fetch(url);
    }

    public async getTeamStyles(
        pathParams: FigmaRestAPI.GetTeamStylesPathParams,
        queryParams?: FigmaRestAPI.GetTeamStylesQueryParams | undefined
    ): Promise<FigmaRestAPI.GetTeamStylesResponse> {
        const url = new URL(`${this.#apiPath}/teams/${pathParams.team_id}/styles`);
        return this.fetch(url, { queryParams });
    }

    public async getFileStyles(
        pathParams: FigmaRestAPI.GetFileStylesPathParams
    ): Promise<FigmaRestAPI.GetFileStylesResponse> {
        const url = new URL(`${this.#apiPath}/files/${pathParams.file_key}/styles`);
        return this.fetch(url);
    }

    public async getStyle(pathParams: FigmaRestAPI.GetStylePathParams): Promise<FigmaRestAPI.GetFileResponse> {
        const url = new URL(`${this.#apiPath}/styles/${pathParams.key}`);
        return this.fetch(url);
    }

    private addQueryParams(url: URL, queryParams: RequestParams["queryParams"]) {
        for (const key in queryParams) {
            url.searchParams.append(key, queryParams[key].toString());
        }
    }

    private async fetch<T>(url: URL, requestParams?: RequestParams): Promise<T> {
        if (requestParams?.queryParams) {
            this.addQueryParams(url, requestParams.queryParams);
        }

        let body: BodyInit | undefined = undefined;
        if (requestParams?.bodyParams) {
            body = JSON.stringify(requestParams.bodyParams);
        }

        const response = await fetch(url, {
            headers: this.#headers,
            method: requestParams?.method || HTTPMethods.GET,
            body,
        });
        // TODO Handle failed response
        return response.json();
    }
}

function isFigmaFileType(value: string | FileType): value is FileType {
    return FileType[value as FileType] !== undefined;
}

class FigmaFile implements File {
    public readonly file_type: FileType;

    public readonly file_key: string;

    public readonly file_name: string;

    constructor(public readonly url: string) {
        const figmaUrl = new URL(url);
        const parts = figmaUrl.pathname.split("/");
        parts.shift(); // pathname begins with "/", so the first entry in the array will be empty string. Shift this off.

        if (parts.length !== 3) {
            throw new Error(`Unable to parse Figma file URL ${url}`);
        }

        const [type, key, name] = parts;
        if (!isFigmaFileType(type)) {
            throw new Error(`Error parsing Figma file URL ${url}\n'${type}' is not a valid Figma file type.`);
        }

        this.file_type = FileType[type];
        this.file_key = key;
        this.file_name = name;
    }
}

/**
 * Figma file types
 */
enum FileType {
    file = "file",
}

/**
 * Interface describing the Figma REST api endpoints
 */
export interface FigmaRESTClient {
    /**
     * https://www.figma.com/developers/api#get-files-endpoint
     */
    getFile(
        pathParams: FigmaRestAPI.GetFilePathParams,
        queryParams?: FigmaRestAPI.GetFilePathParams
    ): Promise<FigmaRestAPI.GetFileResponse>;

    /**
     * https://www.figma.com/developers/api#get-file-nodes-endpoint
     */
    getFileNodes(
        pathParams: FigmaRestAPI.GetFileNodesPathParams,
        queryParams?: FigmaRestAPI.GetFileNodesQueryParams
    ): Promise<FigmaRestAPI.GetFileNodesResponse>;

    /**
     * https://www.figma.com/developers/api#get-images-endpoint
     */
    getImages(
        pathParams: FigmaRestAPI.GetImagesPathParams,
        queryParams?: FigmaRestAPI.GetImagesQueryParams
    ): Promise<FigmaRestAPI.GetImagesResponse>;

    /**
     * https://www.figma.com/developers/api#get-image-fills-endpoint
     */
    getImageFill(pathParams: FigmaRestAPI.GetImageFillsPathParams): Promise<FigmaRestAPI.GetImageFillsResponse>;

    /**
     * https://www.figma.com/developers/api#get-comments-endpoint
     */
    getComments(
        pathParams: FigmaRestAPI.GetCommentsPathParams,
        queryParams?: FigmaRestAPI.GetCommentsQueryParams
    ): Promise<FigmaRestAPI.GetCommentsResponse>;

    /**
     * https://www.figma.com/developers/api#post-comments-endpoint
     */
    postComments(
        pathParams: FigmaRestAPI.PostCommentPathParams,
        queryParams: FigmaRestAPI.PostCommentRequestBody
    ): Promise<FigmaRestAPI.PostCommentResponse>;

    /**
     * https://www.figma.com/developers/api#delete-comments-endpoint
     */
    deleteComments(pathParams: FigmaRestAPI.DeleteCommentPathParams): Promise<FigmaRestAPI.DeleteCommentResponse>;

    /**
     * https://www.figma.com/developers/api#get-comment-reactions-endpoint
     */
    getCommentReactions(
        pathParams: FigmaRestAPI.GetCommentReactionsPathParams,
        queryParams?: FigmaRestAPI.GetCommentReactionsQueryParams
    ): Promise<FigmaRestAPI.GetCommentReactionsResponse>;

    /**
     * https://www.figma.com/developers/api#post-comment-reactions-endpoint
     */
    postCommentReactions(
        pathParams: FigmaRestAPI.PostCommentReactionPathParams,
        queryParams: FigmaRestAPI.PostCommentReactionRequestBody
    ): Promise<FigmaRestAPI.PostCommentReactionResponse>;

    /**
     * https://www.figma.com/developers/api#delete-comment-reactions-endpoint
     */
    deleteCommentReactions(
        pathParams: FigmaRestAPI.DeleteCommentReactionPathParams,
        queryParams?: FigmaRestAPI.DeleteCommentReactionQueryParams
    ): Promise<FigmaRestAPI.DeleteCommentReactionResponse>;

    /**
     * https://www.figma.com/developers/api#users-endpoints
     *
     * @remarks
     * Requires OAuth authentication.
     */
    getMe(): Promise<FigmaRestAPI.GetMeResponse>;

    /**
     * https://www.figma.com/developers/api#version-history-endpoints
     */
    getVersion(
        pathParams: FigmaRestAPI.GetFileVersionsPathParams,
        queryParams?: FigmaRestAPI.GetFileVersionsQueryParams
    ): Promise<FigmaRestAPI.GetFileVersionsResponse>;

    /**
     * https://www.figma.com/developers/api#get-team-projects-endpoint
     */
    getTeamProjects(pathParams: FigmaRestAPI.GetTeamProjectsPathParams): Promise<FigmaRestAPI.GetTeamProjectsResponse>;

    /**
     * https://www.figma.com/developers/api#get-team-projects-endpoint
     */
    getTeamProjects(pathParams: FigmaRestAPI.GetTeamProjectsPathParams): Promise<FigmaRestAPI.GetTeamProjectsResponse>;

    /**
     * https://www.figma.com/developers/api#get-project-files-endpoint
     */
    getProjectFiles(
        pathParams: FigmaRestAPI.GetProjectFilesPathParams,
        queryParams?: FigmaRestAPI.GetProjectFilesQueryParams
    ): Promise<FigmaRestAPI.GetProjectFilesResponse>;

    /**
     * https://www.figma.com/developers/api#get-team-components-endpoint
     */
    getTeamComponents(
        pathParams: FigmaRestAPI.GetTeamComponentsPathParams,
        queryParams?: FigmaRestAPI.GetTeamComponentsQueryParams
    ): Promise<FigmaRestAPI.GetTeamComponentsResponse>;

    /**
     * https://www.figma.com/developers/api#get-file-components-endpoint
     */
    getFileComponents(
        pathParams: FigmaRestAPI.GetFileComponentsPathParams,
        queryParams: FigmaRestAPI.GetFilePathParams
    ): Promise<FigmaRestAPI.GetFileComponentsResponse>;

    /**
     * https://www.figma.com/developers/api#get-component-endpoint
     */
    getComponent(pathParams: FigmaRestAPI.GetComponentPathParams): Promise<FigmaRestAPI.GetComponentResponse>;

    /**
     * https://www.figma.com/developers/api#get-team-component-sets-endpoint
     */
    getTeamComponentSets(
        pathParams: FigmaRestAPI.GetTeamComponentSetsPathParams,
        queryParams?: FigmaRestAPI.GetTeamComponentSetsQueryParams
    ): Promise<FigmaRestAPI.GetTeamComponentSetsResponse>;

    /*
     * https://www.figma.com/developers/api#get-file-component-sets-endpoint
     */
    getFileComponentSets(
        pathParams: FigmaRestAPI.GetFileComponentSetsPathParams,
        queryParams?: FigmaRestAPI.GetFileQueryParams
    ): Promise<FigmaRestAPI.GetFileComponentSetsResponse>;

    /**
     * https://www.figma.com/developers/api#get-component-sets-endpoint
     */
    getComponentSets(pathParams: FigmaRestAPI.GetComponentSetPathParams): Promise<FigmaRestAPI.GetComponentSetResponse>;

    /**
     * https://www.figma.com/developers/api#get-team-styles-endpoint
     */
    getTeamStyles(
        pathParams: FigmaRestAPI.GetTeamStylesPathParams,
        queryParams?: FigmaRestAPI.GetTeamStylesQueryParams
    ): Promise<FigmaRestAPI.GetTeamStylesResponse>;

    /**
     * https://www.figma.com/developers/api#get-file-styles-endpoint
     */
    getFileStyles(pathParams: FigmaRestAPI.GetFileStylesPathParams): Promise<FigmaRestAPI.GetFileStylesResponse>;

    /**
     * https://www.figma.com/developers/api#get-style-endpoint
     */
    getStyle(pathParams: FigmaRestAPI.GetStylePathParams): Promise<FigmaRestAPI.GetFileResponse>;
}

/**
 * Describes a parsed Figma file.
 * https://www.figma.com/developers/api#files-endpoints
 */
export interface File {
    /**
     * The URL of the figma file
     */
    readonly url: string;

    /**
     * The type of a file
     */
    readonly file_type: FileType;

    /**
     * The file key
     */
    readonly file_key: string;

    /**
     * The name of the file
     */
    readonly file_name: string;
}

export interface ClientArgs {
    /**
     * Personal access token
     */
    pat: string;
}

/**
 * Constructs a {@link @IFigmaFile} from a figma file URL.
 */
export function parseFilePath(fileUrl: string): File {
    return new FigmaFile(fileUrl);
}
