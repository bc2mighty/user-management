module Api
    module V1
        class UsersController < ApplicationController
            protect_from_forgery prepend: true

            def index
                if params.key?"page"
                    pages = User.all.size.to_i / 25
                    page = (params['page'].to_i - 1) * 25
                    users = User.order('updated_at DESC').limit(25).offset(page)
                    render json: {status: true, message: 'Loaded Users', data:users, 'pages': pages}, status: :ok
                else
                    render json: {status: false, message: 'Please Provide Page'}, status: :bad_request
                end
            end

            def show
                begin
                    user = User.find(params[:id])
                    render json: {status: true, message: 'Loaded User', data:user}, status: :ok
                rescue => e
                    render json: {status: false, message: e.message}, status: :bad_request
                end
            end

            def create
                user = User.new(user_params)
                if user.save
                    render json: {status: true, message: 'Saved User', data:user}, status: :ok
                else
                    render json: {status: false, message: user.errors}, status: :bad_request
                end
            end

            def destroy
                user = User.find(params[:id])
                user.destroy
                render json: {status: true, message: 'Deleted User', data:user}, status: :ok
            end

            def update
                user = User.find(params[:id])
                if user.update(user_params)
                    render json: {status: true, message: 'Updated User', data:user}, status: :ok
                else
                    render json: {status: false, message: user.errors}, status: :bad_request
                end
            end

            private
                def user_params
                    params.permit(:name, :email, :title, :phone, :status)
                end
        end
    end
end