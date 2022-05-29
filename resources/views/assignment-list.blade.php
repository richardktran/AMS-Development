<html>
    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    </head>
    <body>
        <div class="container">
            <table class="table">
                <tr>
                    <th>No.</th>
                    <th>Asset Code</th>
                    <th>Asset Name</th>
                    <th>Assigned to</th>
                    <th>Assigned by</th>
                    <th>Assigned Date</th>
                    <th>State</th>
                    <th>Assign Note</th>
                </tr>
                @foreach($assigns as $assign)
                    <tr>
                        <td>{{ $assign->id }}</td>
                        <td>{{ $assign->asset->asset_code }}</td>
                        <td>{{ $assign->asset->asset_name }}</td>
                        <td>{{ $assign->assignedToUser->username }}</td>
                        <td>{{ $assign->assignedByUser->username }}</td>
                        <td>{{ $assign->assign_date->format('d/m/Y') }}</td>
                        <td>{{ $assign->state_name }}</td>
                        <td>{{ $assign->assign_note }}</td>
                    </tr>
                @endforeach
            </table>
        </div>
    </body>
</html>

