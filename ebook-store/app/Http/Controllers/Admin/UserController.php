<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $sort      = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        $users = User::orderBy($sort, $direction)
            ->paginate(15)
            ->appends(compact('sort', 'direction'))
            ->through(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'is_admin'   => $u->is_admin,
                'created_at' => $u->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users'     => $users,
            'sort'      => $sort,
            'direction' => $direction,
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'is_admin' => (bool) $user->is_admin,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'is_admin' => 'boolean',
        ]);

        $user->update($data);

        // Redirect back to the admin users index with a success flash
        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        // Prevent self-delete
        if (auth()->id() === $user->id) {
            return back()
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        // Redirect back to the admin users index with a success flash
        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
